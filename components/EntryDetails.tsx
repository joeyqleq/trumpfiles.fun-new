import { AICompleteTrumpData } from "@/types/database";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EntryDetailsProps {
  entry: AICompleteTrumpData;
}

export function EntryDetails({ entry }: EntryDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{entry.title}</CardTitle>
        <CardDescription>{entry.synopsis}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-bold">Category</h4>
            <p>{entry.category}</p>
          </div>
          <div>
            <h4 className="font-bold">Subcategory</h4>
            <p>{entry.subcategory}</p>
          </div>
          <div>
            <h4 className="font-bold">Phase</h4>
            <p>{entry.phase}</p>
          </div>
          <div>
            <h4 className="font-bold">Age</h4>
            <p>{entry.age}</p>
          </div>
          {entry.date_start && (
            <div>
              <h4 className="font-bold">Start Date</h4>
              <p>{new Date(entry.date_start).toLocaleDateString()}</p>
            </div>
          )}
          {entry.date_end && (
            <div>
              <h4 className="font-bold">End Date</h4>
              <p>{new Date(entry.date_end).toLocaleDateString()}</p>
            </div>
          )}
          <div>
            <h4 className="font-bold">Duration (days)</h4>
            <p>{entry.duration_days}</p>
          </div>
          <div>
            <h4 className="font-bold">Fucked-up Score</h4>
            <p>{entry.fucked_up_score}</p>
          </div>
          <div>
            <h4 className="font-bold">Danger</h4>
            <p>{entry.danger}</p>
          </div>
          <div>
            <h4 className="font-bold">Authoritarianism</h4>
            <p>{entry.authoritarianism}</p>
          </div>
          <div>
            <h4 className="font-bold">Lawlessness</h4>
            <p>{entry.lawlessness}</p>
          </div>
          <div>
            <h4 className="font-bold">Insanity</h4>
            <p>{entry.insanity}</p>
          </div>
          <div>
            <h4 className="font-bold">Absurdity</h4>
            <p>{entry.absurdity}</p>
          </div>
          <div>
            <h4 className="font-bold">Credibility Risk</h4>
            <p>{entry.credibility_risk}</p>
          </div>
          <div>
            <h4 className="font-bold">Recency Intensity</h4>
            <p>{entry.recency_intensity}</p>
          </div>
          <div>
            <h4 className="font-bold">Impact Scope</h4>
            <p>{entry.impact_scope}</p>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="font-bold">Rationale</h4>
          <p>{entry.rationale_short}</p>
        </div>
        <div className="mt-4">
          <h4 className="font-bold">Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {entry.all_keywords.map((keyword) => (
              <Badge key={keyword} variant="secondary">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}