"""
Backend API Tests for TrumpFiles.fun Next.js App
Tests verify that hardcoded 1,000 limits have been removed and all counts are dynamic from Neon DB
"""
import pytest
import requests
import os

# Use localhost since we're testing the Next.js server directly
BASE_URL = "http://localhost:3000"

class TestEntryCountAPI:
    """Tests for /api/entry-count endpoint - should return real count from DB"""
    
    def test_entry_count_returns_real_count(self):
        """Verify entry count is > 1000 (not hardcoded)"""
        response = requests.get(f"{BASE_URL}/api/entry-count")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "count" in data, "Response should contain 'count' field"
        assert "formatted" in data, "Response should contain 'formatted' field"
        
        # The real count should be ~2295, definitely > 1000
        count = data["count"]
        assert count > 1000, f"Count should be > 1000 (not hardcoded), got {count}"
        assert count > 2000, f"Count should be ~2295, got {count}"
        print(f"✅ Entry count API returns real count: {count}")
    
    def test_entry_count_formatted_matches_count(self):
        """Verify formatted string matches the count"""
        response = requests.get(f"{BASE_URL}/api/entry-count")
        data = response.json()
        
        count = data["count"]
        formatted = data["formatted"]
        
        # Formatted should be the count with commas
        expected_formatted = f"{count:,}"
        assert formatted == expected_formatted, f"Formatted '{formatted}' should match '{expected_formatted}'"
        print(f"✅ Formatted count matches: {formatted}")


class TestCatalogDataAPI:
    """Tests for /api/catalog-data endpoint - should return ALL entries (>1000)"""
    
    def test_catalog_data_returns_all_entries(self):
        """Verify catalog data returns > 1000 entries (not capped)"""
        response = requests.get(f"{BASE_URL}/api/catalog-data", timeout=60)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert isinstance(data, list), "Response should be a list of entries"
        
        entry_count = len(data)
        assert entry_count > 1000, f"Should return > 1000 entries (not capped), got {entry_count}"
        assert entry_count > 2000, f"Should return ~2295 entries, got {entry_count}"
        print(f"✅ Catalog data API returns {entry_count} entries (not capped at 1000)")
    
    def test_catalog_data_entry_structure(self):
        """Verify catalog entries have expected fields"""
        response = requests.get(f"{BASE_URL}/api/catalog-data", timeout=60)
        data = response.json()
        
        if len(data) > 0:
            entry = data[0]
            # Check for key fields
            expected_fields = ["entry_number", "title", "category", "synopsis"]
            for field in expected_fields:
                assert field in entry, f"Entry should have '{field}' field"
            print(f"✅ Catalog entries have expected structure")


class TestVisualizerDataAPI:
    """Tests for /api/visualizer-data endpoint - should return ALL entries (>1000)"""
    
    def test_visualizer_data_returns_all_entries(self):
        """Verify visualizer data returns > 1000 entries (not capped)"""
        response = requests.get(f"{BASE_URL}/api/visualizer-data", timeout=60)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert isinstance(data, list), "Response should be a list of entries"
        
        entry_count = len(data)
        assert entry_count > 1000, f"Should return > 1000 entries (not capped), got {entry_count}"
        assert entry_count > 2000, f"Should return ~2295 entries, got {entry_count}"
        print(f"✅ Visualizer data API returns {entry_count} entries (not capped at 1000)")
    
    def test_visualizer_data_entry_structure(self):
        """Verify visualizer entries have expected fields"""
        response = requests.get(f"{BASE_URL}/api/visualizer-data", timeout=60)
        data = response.json()
        
        if len(data) > 0:
            entry = data[0]
            # Check for key fields used in visualizer
            expected_fields = ["entry_number", "title", "category", "danger", "absurdity"]
            for field in expected_fields:
                assert field in entry, f"Entry should have '{field}' field"
            print(f"✅ Visualizer entries have expected structure")


class TestCountConsistency:
    """Tests to verify counts are consistent across all endpoints"""
    
    def test_all_counts_match(self):
        """Verify entry-count, catalog-data, and visualizer-data all return same count"""
        # Get entry count
        count_response = requests.get(f"{BASE_URL}/api/entry-count")
        entry_count = count_response.json()["count"]
        
        # Get catalog data count
        catalog_response = requests.get(f"{BASE_URL}/api/catalog-data", timeout=60)
        catalog_count = len(catalog_response.json())
        
        # Get visualizer data count
        visualizer_response = requests.get(f"{BASE_URL}/api/visualizer-data", timeout=60)
        visualizer_count = len(visualizer_response.json())
        
        # All should match (or be very close - entry-count queries trump_entries, others query ai_complete_trump_data)
        print(f"Entry count API: {entry_count}")
        print(f"Catalog data count: {catalog_count}")
        print(f"Visualizer data count: {visualizer_count}")
        
        # Catalog and visualizer should match exactly
        assert catalog_count == visualizer_count, f"Catalog ({catalog_count}) and Visualizer ({visualizer_count}) counts should match"
        
        # Entry count should be close (may differ slightly due to different tables)
        assert abs(entry_count - catalog_count) < 100, f"Entry count ({entry_count}) should be close to catalog count ({catalog_count})"
        print(f"✅ All counts are consistent")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
