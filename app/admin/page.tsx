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
        data-oid="7.sxn:4"
      >
        Loading...
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        data-oid="p5ckdk7"
      >
        <Card className="glass-card border-white/10 p-8" data-oid="28k2c.-">
          <CardHeader data-oid="1c:u-u9">
            <CardTitle data-oid="0r1cl3r">Authentication Required</CardTitle>
            <CardDescription data-oid="8:3h9hl">
              Please sign in to access the admin panel
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen golden-p-5" data-oid="whx0t:4">
      <div className="container mx-auto px-4 max-w-7xl" data-oid="f0vo0se">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
          data-oid="4iuxy-t"
        >
          <TrumpFilesHeading
            className="text-4xl font-bold mb-2"
            data-oid="0:7kcfy"
          >
            Admin Dashboard
          </TrumpFilesHeading>
          <p className="text-foreground/70 font-sans" data-oid="n_78w3_">
            Manage Trump Files data and monitor system analytics
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8" data-oid="09rwjjz">
          <Card className="glass-card border-white/10" data-oid="eqnul1j">
            <CardHeader className="pb-3" data-oid="ncpq7lp">
              <CardDescription data-oid="7udzkez">
                Total Entries
              </CardDescription>
            </CardHeader>
            <CardContent data-oid="ucwhhzj">
              <div className="flex items-center gap-2" data-oid="lg6z94j">
                <Database className="h-8 w-8 text-primary" data-oid="7e8ppcg" />
                <span className="text-3xl font-bold" data-oid="dbeb112">
                  {stats.totalEntries}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10" data-oid="sylryie">
            <CardHeader className="pb-3" data-oid="tts0ksz">
              <CardDescription data-oid="q2sy0ht">
                User Comments
              </CardDescription>
            </CardHeader>
            <CardContent data-oid="yxzuf2i">
              <div className="flex items-center gap-2" data-oid="dn5ufv1">
                <MessageSquare
                  className="h-8 w-8 text-accent"
                  data-oid="t2r:2db"
                />

                <span className="text-3xl font-bold" data-oid="a8dk33l">
                  {stats.totalComments}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10" data-oid="x5pgq2q">
            <CardHeader className="pb-3" data-oid="3qgb6cs">
              <CardDescription data-oid="otmucp9">User Scores</CardDescription>
            </CardHeader>
            <CardContent data-oid="u1_dzap">
              <div className="flex items-center gap-2" data-oid="q_lp7g9">
                <Users className="h-8 w-8 text-blue-500" data-oid="zri:5op" />
                <span className="text-3xl font-bold" data-oid="okrd7du">
                  {stats.totalScores}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10" data-oid="-pmcn4i">
            <CardHeader className="pb-3" data-oid="yvlw:65">
              <CardDescription data-oid="03tawnw">
                Avg Danger Score
              </CardDescription>
            </CardHeader>
            <CardContent data-oid="jgcpp-2">
              <div className="flex items-center gap-2" data-oid="i:sr36v">
                <TrendingUp
                  className="h-8 w-8 text-orange-500"
                  data-oid=".3chuss"
                />

                <span className="text-3xl font-bold" data-oid="4b6dyx7">
                  {stats.avgDanger}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        {/*
        <Tabs defaultValue="upload" className="space-y-4" data-oid="i_-7yt9">
          <TabsList className="bg-white/5" data-oid="fhhh_w.">
            <TabsTrigger value="upload" data-oid="ucjj90q">
              JSON Upload
            </TabsTrigger>
            <TabsTrigger value="data" data-oid="d1bhqmo">
              Data Table
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" data-oid="w5n8y.f">
            <Card className="glass-card border-white/10" data-oid="09sop-j">
              <CardHeader data-oid="eogi6i7">
                <CardTitle
                  className="flex items-center gap-2"
                  data-oid=".u6rv2q"
                >
                  <FileJson className="h-5 w-5" data-oid="192mw9:" />
                  Upload JSON Data
                </CardTitle>
                <CardDescription data-oid="uq0i3ap">
                  Upload a JSON file containing new Trump Files entries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6" data-oid="ewm7bt2">
                <div
                  className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center"
                  data-oid="f:333_8"
                >
                  <Upload
                    className="h-12 w-12 text-foreground/50 mx-auto mb-4"
                    data-oid="efepzwk"
                  />

                  <Input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="max-w-sm mx-auto"
                    data-oid="ddxkwxg"
                  />

                  <p
                    className="text-sm text-foreground/50 mt-2"
                    data-oid="xe8zsve"
                  >
                    Select a JSON file to upload
                  </p>
                </div>

                {jsonFile && (
                  <div className="space-y-4" data-oid="h:qsnkt">
                    <div
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                      data-oid="wo8yl1d"
                    >
                      <span className="text-sm" data-oid="2gv32fh">
                        File: {jsonFile.name}
                      </span>
                      <Badge
                        variant={
                          validationErrors.length === 0
                            ? "default"
                            : "destructive"
                        }
                        data-oid="9cxq5dv"
                      >
                        {validationErrors.length === 0
                          ? "Valid"
                          : `${validationErrors.length} errors`}
                      </Badge>
                    </div>

                    {validationErrors.length > 0 && (
                      <Alert
                        className="bg-orange-500/10 border-orange-500/50"
                        data-oid="3th0z8o"
                      >
                        <AlertTriangle className="h-4 w-4" data-oid="5aflbpg" />
                        <AlertDescription data-oid="w0l9at:">
                          <p className="font-semibold mb-2" data-oid="8s-.gzv">
                            Validation Errors:
                          </p>
                          <ul
                            className="list-disc list-inside space-y-1"
                            data-oid="6uelg2i"
                          >
                            {validationErrors.slice(0, 10).map((error, i) => (
                              <li
                                key={i}
                                className="text-sm"
                                data-oid="h.lonez"
                              >
                                {error.line && `Line ${error.line}: `}
                                {error.field} - {error.message}
                              </li>
                            ))}
                            {validationErrors.length > 10 && (
                              <li className="text-sm" data-oid="rnsnx86">
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
                            : "bg-orange-500/10 border-orange-500/50"
                        }
                        data-oid="wj9bs4h"
                      >
                        {uploadResult.success ? (
                          <CheckCircle className="h-4 w-4" data-oid="dmwonbk" />
                        ) : (
                          <AlertTriangle
                            className="h-4 w-4"
                            data-oid="lrdf48y"
                          />
                        )}
                        <AlertDescription data-oid="kzg_xz0">
                          {uploadResult.message}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      onClick={handleUpload}
                      disabled={uploading || validationErrors.length > 0}
                      className="w-full"
                      data-oid="k1h:2sl"
                    >
                      {uploading ? "Uploading..." : "Upload Entries"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" data-oid="krg6bm5">
            <Card className="glass-card border-white/10" data-oid="j2w.-9.">
              <CardHeader data-oid="c_g1k5a">
                <CardTitle data-oid="gd86sva">Recent Entries</CardTitle>
                <CardDescription data-oid="ryr88ob">
                  View and manage the latest entries in the database
                </CardDescription>
              </CardHeader>
              <CardContent data-oid="1d6iemt">
                <div className="overflow-x-auto" data-oid="ftr4kpy">
                  <table className="w-full text-sm" data-oid="o372jbt">
                    <thead data-oid="32kjt_m">
                      <tr
                        className="border-b border-white/10"
                        data-oid="q4_hc-0"
                      >
                        <th className="text-left p-2" data-oid="mmkscv2">
                          #
                        </th>
                        <th className="text-left p-2" data-oid="xnrj:v6">
                          Title
                        </th>
                        <th className="text-left p-2" data-oid="3upp_dy">
                          Category
                        </th>
                        <th className="text-left p-2" data-oid="3ek95yg">
                          Phase
                        </th>
                        <th className="text-left p-2" data-oid="llp40dy">
                          Danger
                        </th>
                        <th className="text-left p-2" data-oid="-_9hwes">
                          Created
                        </th>
                      </tr>
                    </thead>
                    <tbody data-oid=":jkjsjj">
                      {entries.map((entry) => (
                        <tr
                          key={entry.entry_number}
                          className="border-b border-white/5 hover:bg-white/5"
                          data-oid="t.hqqdk"
                        >
                          <td className="p-2" data-oid="65suo2e">
                            {entry.entry_number}
                          </td>
                          <td
                            className="p-2 max-w-xs truncate"
                            data-oid="c-y70sg"
                          >
                            {entry.title}
                          </td>
                          <td className="p-2" data-oid="uvp_xmz">
                            <Badge
                              variant="secondary"
                              className="text-xs"
                              data-oid="06xan0u"
                            >
                              {entry.category}
                            </Badge>
                          </td>
                          <td className="p-2" data-oid="5xqyu6m">
                            {entry.phase}
                          </td>
                          <td className="p-2" data-oid="bmlh5wk">
                            <span className={`font-mono`} data-oid="1:9ivif">
                              {entry.danger_score}/10
                            </span>
                          </td>
                          <td
                            className="p-2 text-foreground/50"
                            data-oid="mybmaea"
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
        */}
      </div>
    </div>
  );
}
