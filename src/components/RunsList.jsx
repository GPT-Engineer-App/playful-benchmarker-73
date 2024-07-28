import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useRuns } from "../integrations/supabase";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronUp, ChevronDown, Eye } from "lucide-react";

const RunsList = () => {
  const navigate = useNavigate();
  const { data: runs, isLoading, isError } = useRuns();
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedRuns = useMemo(() => {
    if (!runs) return [];
    return [...runs].sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [runs, sortField, sortDirection]);

  const handleViewResults = (id) => {
    navigate(`/run-results/${id}`);
  };

  if (isLoading) return <div>Loading runs...</div>;
  if (isError) return <div>Error loading runs</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Recent Runs</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => handleSort("created_at")}>
              Date {sortField === "created_at" && (sortDirection === "asc" ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("system_version")}>
              System Version {sortField === "system_version" && (sortDirection === "asc" ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("project_id")}>
              Project ID {sortField === "project_id" && (sortDirection === "asc" ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("impersonation_failed")}>
              Impersonation Failed {sortField === "impersonation_failed" && (sortDirection === "asc" ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRuns.map((run) => (
            <TableRow key={run.id}>
              <TableCell>{new Date(run.created_at).toLocaleString()}</TableCell>
              <TableCell>{run.system_version}</TableCell>
              <TableCell>{run.project_id}</TableCell>
              <TableCell>{run.impersonation_failed ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => handleViewResults(run.id)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Results
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RunsList;
