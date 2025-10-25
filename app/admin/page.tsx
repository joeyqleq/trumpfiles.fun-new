"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { TrumpEntry } from "@/types/database";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  Database,
  CheckCircle,
  AlertTriangle,
  FileJson,
  Users,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import { TrumpFilesHeading } from "@/components/TrumpFilesBrand";

interface JsonValidationError {
  field: string;
  message: string;
  line?: number;
}

export default function AdminPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const [entries, setEntries] = useState<TrumpEntry[]>([]);
  const [stats, setStats] = useState({
    totalEntries: 0,
    totalComments: 0,
    totalScores: 0,
    avgDanger: 0,
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
    errors?: JsonValidationError[];
  } | null>(null);
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [jsonContent, setJsonContent] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<
    JsonValidationError[]
  >([]);

  useEffect(() => {
    if (isSignedIn) {
      fetchData();
    }
  }, [isSignedIn]);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/admin-data");
      const data = await response.json();
      if (response.ok) {
        setEntries(data.entries || []);
        setStats(
          data.stats || {
            totalEntries: 0,
            totalComments: 0,
            totalScores: 0,
            avgDanger: 0,
          },
        );
      } else {
        throw new Error(data.error || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setJsonFile(file);
    const text = await file.text();
    setJsonContent(text);
    validateJson(text);
  };

  const validateJson = (content: string) => {
    const errors: JsonValidationError[] = [];

    try {
      const data = JSON.parse(content);

      if (!Array.isArray(data)) {
        errors.push({
          field: "root",
          message: "JSON must be an array of entries",
        });
        setValidationErrors(errors);
        return;
      }

      data.forEach((entry, index) => {
        // Required fields
        const requiredFields = [
          "entry_number",
          "title",
          "phase",
          "category",
          "synopsis",
          "danger_score",
          "lawlessness_score",
          "insanity_score",
          "absurdity_score",
          "social_media_score",
          "media_attention_score",
        ];

        requiredFields.forEach((field) => {
          if (!(field in entry)) {
            errors.push({
              field: field,
              message: `Missing required field "${field}"`,
              line: index + 1,
            });
          }
        });

        // Type checks
        const scoreFields = [
          "danger_score",
          "lawlessness_score",
          "insanity_score",
          "absurdity_score",
          "social_media_score",
          "media_attention_score",
        ];

        scoreFields.forEach((field) => {
          if (
            field in entry &&
            (typeof entry[field] !== "number" ||
              entry[field] < 0 ||
              entry[field] > 10)
          ) {
            errors.push({
              field: field,
              message: `${field} must be a number between 0 and 10`,
              line: index + 1,
            });
          }
        });

        // Check for duplicate entry numbers
        const entryNumbers = data.map((e) => e.entry_number);
        const duplicates = entryNumbers.filter(
          (item, index) => entryNumbers.indexOf(item) !== index,
        );
        if (duplicates.length > 0) {
          errors.push({
            field: "entry_number",
            message: `Duplicate entry numbers found: ${duplicates.join(", ")}`,
          });
        }
      });
    } catch (e) {
      errors.push({
        field: "json",
        message: "Invalid JSON format",
      });
    }

    setValidationErrors(errors);
  };

  const handleUpload = async () => {
    if (!jsonContent || validationErrors.length > 0) {
      setUploadResult({
        success: false,
        message: "Please fix validation errors before uploading",
        errors: validationErrors,
      });
      return;
    }

    setUploading(true);
    try {
      const data = JSON.parse(jsonContent);
      const response = await fetch("/api/upload-entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setUploadResult({
          success: true,
          message: result.message,
        });
        fetchData(); // Refresh data on success
      } else {
        throw new Error(result.message || "Upload failed");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadResult({
        success: false,
        message: error.message || "Failed to upload entries",
      });
    } finally {
      setUploading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        data-oid="y8yyw8w"
      >
        Loading...
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        data-oid="6fnuktv"
      >
        <Card className="glass-card border-white/10 p-8" data-oid="zk4w93m">
          <CardHeader data-oid="jy5qo7y">
            <CardTitle data-oid="mtjy1w9">Authentication Required</CardTitle>
            <CardDescription data-oid="sq914be">
              Please sign in to access the admin panel
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen golden-p-5" data-oid="jl.fnse">
      <div className="container mx-auto px-4 max-w-7xl" data-oid="nutbole">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
          data-oid="rle-na:"
        >
          <TrumpFilesHeading
            as="h1"
            className="text-4xl font-bold mb-2"
            data-oid="tvac6xx"
          >
            Admin Dashboard
          </TrumpFilesHeading>
          <p className="text-foreground/70 font-sans" data-oid="8fv8r6e">
            Manage Trump Files data and monitor system analytics
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8" data-oid="mycxlhp">
          <Card className="glass-card border-white/10" data-oid="uv_zrs_">
            <CardHeader className="pb-3" data-oid="5paumhq">
              <CardDescription data-oid="1eyom9g">
                Total Entries
              </CardDescription>
            </CardHeader>
            <CardContent data-oid="8uflb21">
              <div className="flex items-center gap-2" data-oid="e8g_.9s">
                <Database className="h-8 w-8 text-primary" data-oid="0-4wvm5" />
                <span className="text-3xl font-bold" data-oid=":h1vj5v">
                  {stats.totalEntries}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10" data-oid="7-7xuys">
            <CardHeader className="pb-3" data-oid="2_3q.we">
              <CardDescription data-oid="ynpke9-">
                User Comments
              </CardDescription>
            </CardHeader>
            <CardContent data-oid="ycjie1i">
              <div className="flex items-center gap-2" data-oid="hwz27h7">
                <MessageSquare
                  className="h-8 w-8 text-accent"
                  data-oid="c1o_zin"
                />
                <span className="text-3xl font-bold" data-oid="naq2s_o">
                  {stats.totalComments}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10" data-oid="w7rur79">
            <CardHeader className="pb-3" data-oid="6-qicd0">
              <CardDescription data-oid="d9:uvs:">User Scores</CardDescription>
            </CardHeader>
            <CardContent data-oid="h.siqm:">
              <div className="flex items-center gap-2" data-oid="mbtytyp">
                <Users className="h-8 w-8 text-blue-500" data-oid="1-mv:7d" />
                <span className="text-3xl font-bold" data-oid="xs-v2sn">
                  {stats.totalScores}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10" data-oid="bl1:4o8">
            <CardHeader className="pb-3" data-oid="-zx861c">
              <CardDescription data-oid=".c2zcca">
                Avg Danger Score
              </CardDescription>
            </CardHeader>
            <CardContent data-oid="bt2o-rv">
              <div className="flex items-center gap-2" data-oid="z3ete4y">
                <TrendingUp
                  className="h-8 w-8 text-orange-500"
                  data-oid="6kyuykv"
                />
                <span className="text-3xl font-bold" data-oid="50-nxdw">
                  {stats.avgDanger}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="upload" className="space-y-4" data-oid="3uqezhh">
          <TabsList className="bg-white/5" data-oid="8wy_k:w">
            <TabsTrigger value="upload" data-oid=".-z_6v1">
              JSON Upload
            </TabsTrigger>
            <TabsTrigger value="data" data-oid="-ahrpk1">
              Data Table
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" data-oid=":g1vujw">
            <Card className="glass-card border-white/10" data-oid="h7ba9su">
              <CardHeader data-oid="oorj.k3">
                <CardTitle
                  className="flex items-center gap-2"
                  data-oid="vspwzep"
                >
                  <FileJson className="h-5 w-5" data-oid="a7pzmro" />
                  Upload JSON Data
                </CardTitle>
                <CardDescription data-oid="mihn_e5">
                  Upload a JSON file containing new Trump Files entries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6" data-oid="l2ebgo3">
                <div
                  className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center"
                  data-oid=".bltb-0"
                >
                  <Upload
                    className="h-12 w-12 text-foreground/50 mx-auto mb-4"
                    data-oid="p67kdn9"
                  />
                  <Input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="max-w-sm mx-auto"
                    data-oid="wg_bdbt"
                  />

                  <p
                    className="text-sm text-foreground/50 mt-2"
                    data-oid=".7r_40i"
                  >
                    Select a JSON file to upload
                  </p>
                </div>

                {jsonFile && (
                  <div className="space-y-4" data-oid="sgx0wg.">
                    <div
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                      data-oid="02m95ry"
                    >
                      <span className="text-sm" data-oid="3t7.adj">
                        File: {jsonFile.name}
                      </span>
                      <Badge
                        variant={
                          validationErrors.length === 0
                            ? "default"
                            : "destructive"
                        }
                        data-oid="shlue0h"
                      >
                        {validationErrors.length === 0
                          ? "Valid"
                          : `${validationErrors.length} errors`}
                      </Badge>
                    </div>

                    {validationErrors.length > 0 && (
                      <Alert
                        className="bg-red-500/10 border-red-500/50"
                        data-oid="c66egy-"
                      >
                        <AlertTriangle className="h-4 w-4" data-oid="t4cdtk4" />
                        <AlertDescription data-oid="hakg2nb">
                          <p className="font-semibold mb-2" data-oid="hpelf8a">
                            Validation Errors:
                          </p>
                          <ul
                            className="list-disc list-inside space-y-1"
                            data-oid="w:c2q30"
                          >
                            {validationErrors.slice(0, 10).map((error, i) => (
                              <li
                                key={i}
                                className="text-sm"
                                data-oid="k4jw:7f"
                              >
                                {error.line && `Line ${error.line}: `}
                                {error.field} - {error.message}
                              </li>
                            ))}
                            {validationErrors.length > 10 && (
                              <li className="text-sm" data-oid="276d8lz">
                                ...and {validationErrors.length - 10} more
                                errors
                              </li>
                            )}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}

                    {uploadResult && (
                      <Alert
                        className={
                          uploadResult.success
                            ? "bg-green-500/10 border-green-500/50"
                            : "bg-red-500/10 border-red-500/50"
                        }
                        data-oid="wqxgng3"
                      >
                        {uploadResult.success ? (
                          <CheckCircle className="h-4 w-4" data-oid="bmoqb1z" />
                        ) : (
                          <AlertTriangle
                            className="h-4 w-4"
                            data-oid="xik29o5"
                          />
                        )}
                        <AlertDescription data-oid="og36jus">
                          {uploadResult.message}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      onClick={handleUpload}
                      disabled={uploading || validationErrors.length > 0}
                      className="w-full"
                      data-oid="0-dsgs7"
                    >
                      {uploading ? "Uploading..." : "Upload Entries"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" data-oid="6.3y_gi">
            <Card className="glass-card border-white/10" data-oid="owg52_f">
              <CardHeader data-oid="rb4qgd2">
                <CardTitle data-oid="84xhnb_">Recent Entries</CardTitle>
                <CardDescription data-oid="2u0jm0v">
                  View and manage the latest entries in the database
                </CardDescription>
              </CardHeader>
              <CardContent data-oid="u30d1.m">
                <div className="overflow-x-auto" data-oid="yt5f8t.">
                  <table className="w-full text-sm" data-oid="k-q-_dr">
                    <thead data-oid="ujycehq">
                      <tr
                        className="border-b border-white/10"
                        data-oid="b54fe56"
                      >
                        <th className="text-left p-2" data-oid="7e:z9mm">
                          #
                        </th>
                        <th className="text-left p-2" data-oid="2q1..qb">
                          Title
                        </th>
                        <th className="text-left p-2" data-oid="3_40hic">
                          Category
                        </th>
                        <th className="text-left p-2" data-oid=":vv4sdd">
                          Phase
                        </th>
                        <th className="text-left p-2" data-oid="6ohzoga">
                          Danger
                        </th>
                        <th className="text-left p-2" data-oid="lx:lm36">
                          Created
                        </th>
                      </tr>
                    </thead>
                    <tbody data-oid="pdalzph">
                      {entries.map((entry) => (
                        <tr
                          key={entry.entry_number}
                          className="border-b border-white/5 hover:bg-white/5"
                          data-oid="mqn69ay"
                        >
                          <td className="p-2" data-oid="bhf_jmd">
                            {entry.entry_number}
                          </td>
                          <td
                            className="p-2 max-w-xs truncate"
                            data-oid="ytuxuog"
                          >
                            {entry.title}
                          </td>
                          <td className="p-2" data-oid="cu69je2">
                            <Badge
                              variant="secondary"
                              className="text-xs"
                              data-oid="q93eszs"
                            >
                              {entry.category}
                            </Badge>
                          </td>
                          <td className="p-2" data-oid="gcdqmq2">
                            {entry.phase}
                          </td>
                          <td className="p-2" data-oid="3e_2m66">
                            <span className={`font-mono`} data-oid="ie35jna">
                              {entry.danger_score}/10
                            </span>
                          </td>
                          <td
                            className="p-2 text-foreground/50"
                            data-oid="rwd8ffq"
                          >
                            {new Date(entry.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
