#!/usr/bin/env python3
"""Validate optional context-rescue insight and impact proposals, without mutation."""
from __future__ import annotations

from decimal import Decimal, InvalidOperation, ROUND_HALF_UP


ENUMS = {
    "event_state": {"realized", "proposed", "threatened", "unclear", "unknown"},
    "action_type": {"discrimination", "deception", "legal_action", "policy_action", "institutional_pressure", "private_benefit", "violence_or_threat", "other", "unknown"},
    "scope": {"individual", "organization", "local", "regional", "national", "international", "unknown"},
    "legal_stage": {"allegation", "investigation", "charged", "adjudicated", "settled", "policy", "not_applicable", "unknown"},
}
CORE_FIELDS = (*ENUMS, "affected_groups", "institutions", "outcome")
DIMENSION_KEYS = ("harm", "reach", "institutions", "procedural_abuse", "self_dealing", "persistence")
WEIGHTS = dict(zip(DIMENSION_KEYS, map(Decimal, ("0.30", "0.20", "0.15", "0.15", "0.10", "0.10"))))
MISSING = object()


def _texts(value):
    """Collect source-backed strings only from explicitly documented evidence containers."""
    texts = []
    if isinstance(value, str):
        texts.append(value)
    elif isinstance(value, dict):
        for key, child in value.items():
            if key in {"quote", "excerpt", "source_excerpt", "source", "text", "supports", "basis_quote", "excerpt_text"}:
                texts.extend(_texts(child))
            elif isinstance(child, (dict, list)):
                texts.extend(_texts(child))
    elif isinstance(value, list):
        for child in value:
            texts.extend(_texts(child))
    return texts


def _meaningful(value):
    if value is None:
        return False
    if isinstance(value, str):
        return value.strip().lower() not in {"", "unknown"}
    if isinstance(value, list):
        return any(_meaningful(item) for item in value)
    return True


def validate(row):
    """Return {status, valid, pending, diagnostics} for one proposed context row.

    `row` may be a direct terminal record or a wrapper with a `record` object.
    No input is mutated. Source quotes are checked only against supplied
    `source_fact_map` or explicitly documented source excerpt containers; this
    does not fetch or independently verify source pages.
    """
    if not isinstance(row, dict):
        return {"status": "invalid", "valid": False, "pending": [],
                "diagnostics": [{"severity": "error", "code": "row_not_object", "path": "$", "message": "Expected an object row."}]}
    data = row.get("record") if isinstance(row.get("record"), dict) else row
    diagnostics, pending = [], []

    def error(code, path, message):
        diagnostics.append({"severity": "error", "code": code, "path": path, "message": message})

    def pend(code, path, message):
        pending.append({"code": code, "path": path, "message": message})
        diagnostics.append({"severity": "pending", "code": code, "path": path, "message": message})

    facts = data.get("insight_facts", MISSING)
    evidence_map = data.get("insight_evidence_map", MISSING)
    evidence_texts = []
    if "source_fact_map" in data:
        evidence_texts.extend(_texts(data["source_fact_map"]))
    for key in ("documented_source_excerpts", "source_excerpts"):
        if key in data:
            evidence_texts.extend(_texts(data[key]))

    if facts is MISSING:
        pend("insight_facts_pending", "insight_facts", "Insight enrichment is absent; no implicit pass is recorded.")
        if evidence_map is MISSING:
            pend("insight_evidence_map_pending", "insight_evidence_map", "Evidence mapping is absent; no implicit pass is recorded.")
    elif not isinstance(facts, dict):
        error("insight_facts_type", "insight_facts", "Expected an object or omit the optional enrichment.")
        if evidence_map is MISSING:
            pend("insight_evidence_map_pending", "insight_evidence_map", "Evidence mapping is absent; no implicit pass is recorded.")
    else:
        for field, allowed in ENUMS.items():
            value = facts.get(field, MISSING)
            if value is MISSING:
                error("core_field_missing", f"insight_facts.{field}", "Required core enum field is missing; use null or unknown when appropriate.")
            elif value is not None and (not isinstance(value, str) or value not in allowed):
                error("core_enum_invalid", f"insight_facts.{field}", f"Expected null or one of {sorted(allowed)}.")
        for field in ("affected_groups", "institutions"):
            value = facts.get(field, MISSING)
            if value is MISSING or not isinstance(value, list) or any(not isinstance(item, str) for item in value):
                error("core_array_invalid", f"insight_facts.{field}", "Expected a string array; use an empty array when unknown.")
        outcome = facts.get("outcome", MISSING)
        if outcome is MISSING or (outcome is not None and not isinstance(outcome, str)):
            error("core_outcome_invalid", "insight_facts.outcome", "Expected a string or null.")
        for field in ("quantities", "relations"):
            value = facts.get(field, MISSING)
            if value is MISSING or not isinstance(value, list) or value:
                error("extension_not_empty", f"insight_facts.{field}", "Core proposal must contain this field as an empty array.")

        if evidence_map is MISSING:
            pend("insight_evidence_map_pending", "insight_evidence_map", "Insight facts are present but their optional evidence map is absent.")
        elif not isinstance(evidence_map, list):
            error("evidence_map_type", "insight_evidence_map", "Expected an array of field/value/quote mappings.")
        else:
            valid_items = []
            for index, item in enumerate(evidence_map):
                path = f"insight_evidence_map[{index}]"
                if not isinstance(item, dict):
                    error("evidence_item_type", path, "Expected an object.")
                    continue
                field = item.get("field")
                value = item.get("value", MISSING)
                quote = item.get("quote", item.get("basis_quote"))
                if not isinstance(field, str) or field not in facts:
                    error("evidence_field_invalid", f"{path}.field", "Field must name a supplied insight_facts field.")
                    continue
                current = facts[field]
                corresponds = (value is not MISSING and
                               (value == current or (isinstance(current, list) and value in current) or
                                (isinstance(value, list) and isinstance(current, list) and all(v in current for v in value))))
                if not corresponds:
                    error("evidence_value_mismatch", f"{path}.value", "Evidence value must correspond exactly to its mapped fact value.")
                    continue
                valid_items.append((field, value))
                if not isinstance(quote, str) or not quote.strip():
                    error("evidence_quote_missing", f"{path}.quote", "A nonempty exact quote is required.")
                elif not any(quote in text for text in evidence_texts):
                    error("evidence_quote_not_in_supplied_material", f"{path}.quote", "Quote must occur literally in source_fact_map or documented source excerpts.")

            if isinstance(facts, dict):
                mapped = set()
                for field, value in valid_items:
                    if isinstance(value, list):
                        mapped.update((field, item) for item in value)
                    else:
                        mapped.add((field, value))
                for field in CORE_FIELDS:
                    value = facts.get(field)
                    if _meaningful(value):
                        targets = [(field, item) for item in value if _meaningful(item)] if isinstance(value, list) else [(field, value)]
                        for target in targets:
                            if target not in mapped:
                                error("fact_without_evidence_mapping", f"insight_facts.{field}", f"No corresponding insight_evidence_map value for {target[1]!r}.")

    impact = data.get("impact_proposal", MISSING)
    if impact is MISSING:
        pend("impact_proposal_pending", "impact_proposal", "Impact enrichment is absent; no implicit pass is recorded.")
    elif not isinstance(impact, dict):
        error("impact_proposal_type", "impact_proposal", "Expected an object or omit the optional enrichment.")
    else:
        status = impact.get("status")
        dimensions = impact.get("dimensions", MISSING)
        total_key = next((key for key in ("weighted_total", "total", "impact_score") if key in impact), None)
        total = impact.get(total_key, MISSING) if total_key else MISSING
        if status == "deferred":
            if dimensions is not None:
                error("deferred_dimensions_not_null", "impact_proposal.dimensions", "Deferred proposals require dimensions=null.")
            if total is not None:
                error("deferred_total_not_null", f"impact_proposal.{total_key or 'weighted_total'}", "Deferred proposals require a null weighted total.")
        elif status == "scored":
            if not isinstance(dimensions, dict):
                error("scored_dimensions_missing", "impact_proposal.dimensions", "Scored proposals require all six dimensions.")
            elif set(dimensions) != set(DIMENSION_KEYS):
                error("dimension_keys_invalid", "impact_proposal.dimensions", f"Expected exactly {list(DIMENSION_KEYS)}.")
            else:
                parsed = {}
                for key in DIMENSION_KEYS:
                    value = dimensions[key]
                    if isinstance(value, bool) or not isinstance(value, (int, float)):
                        error("dimension_type_invalid", f"impact_proposal.dimensions.{key}", "Expected a number from 0 to 10 with exactly one decimal place.")
                        continue
                    if isinstance(value, int):
                        error("dimension_precision_invalid", f"impact_proposal.dimensions.{key}", "Expected an explicit one-decimal numeric value, such as 5.0.")
                        continue
                    try:
                        number = Decimal(str(value))
                    except (InvalidOperation, ValueError):
                        error("dimension_type_invalid", f"impact_proposal.dimensions.{key}", "Expected a number from 0 to 10 with exactly one decimal place.")
                        continue
                    if not number.is_finite() or number < 0 or number > 10 or number * 10 != (number * 10).to_integral_value():
                        error("dimension_value_invalid", f"impact_proposal.dimensions.{key}", "Expected a finite 0..10 value in 0.1 increments.")
                    else:
                        parsed[key] = number
                if len(parsed) == len(DIMENSION_KEYS):
                    expected_total = sum(parsed[k] * WEIGHTS[k] for k in DIMENSION_KEYS).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
                    if total is MISSING:
                        error("scored_total_missing", "impact_proposal.weighted_total", "Scored proposal requires its two-decimal weighted total.")
                    else:
                        try:
                            observed = Decimal(str(total))
                        except (InvalidOperation, ValueError):
                            observed = Decimal("NaN")
                        if not observed.is_finite() or observed != expected_total:
                            error("weighted_total_mismatch", f"impact_proposal.{total_key or 'weighted_total'}", f"Expected {expected_total} from the six weighted dimensions.")
        else:
            error("impact_status_invalid", "impact_proposal.status", "Expected status scored or deferred.")

    result_status = "invalid" if any(d["severity"] == "error" for d in diagnostics) else "pending" if pending else "valid"
    return {"status": result_status, "valid": result_status == "valid", "pending": pending, "diagnostics": diagnostics}
