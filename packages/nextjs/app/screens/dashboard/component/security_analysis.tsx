// app/screens/dashboard/component/security_analysis.tsx
import React from "react";
import { Activity, AlertTriangle, Code, LucideIcon, Settings, Shield } from "lucide-react";

interface SecurityMetric {
  score: number;
  details: string[];
  risk_level: string;
}

interface SecurityAnalysisResponse {
  overall_score: number;
  complexity: SecurityMetric;
  vulnerabilities: SecurityMetric;
  upgradability: SecurityMetric;
  behavior: SecurityMetric;
}

interface SecurityAnalysisProps {
  analysis: SecurityAnalysisResponse;
}

interface MetricCardProps {
  title: string;
  icon: LucideIcon;
  metric: SecurityMetric;
}

const SecurityAnalysis: React.FC<SecurityAnalysisProps> = ({ analysis }) => {
  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getRiskBadgeColor = (risk: string): string => {
    switch (risk.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const MetricCard: React.FC<MetricCardProps> = ({ title, icon: Icon, metric }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Icon className="mr-2 h-6 w-6" />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <span className={`text-3xl font-bold ${getScoreColor(metric.score)}`}>{metric.score}%</span>
      </div>
      <div className="space-y-2">
        <span className={`inline-block px-3 py-1 rounded-full text-sm ${getRiskBadgeColor(metric.risk_level)}`}>
          {metric.risk_level} Risk
        </span>
        <ul className="mt-3 space-y-1">
          {metric.details.map((detail: string, index: number) => (
            <li key={index} className="text-sm text-gray-600 flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-gray-400 mt-1.5 mr-2" />
              {detail}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="mr-2 h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Overall Security Score</h2>
              <p className="text-gray-600">Comprehensive security assessment</p>
            </div>
          </div>
          <span className={`text-4xl font-bold ${getScoreColor(analysis.overall_score)}`}>
            {analysis.overall_score}%
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard title="Code Complexity" icon={Code} metric={analysis.complexity} />
        <MetricCard title="Security Issues" icon={AlertTriangle} metric={analysis.vulnerabilities} />
        <MetricCard title="Upgradability" icon={Settings} metric={analysis.upgradability} />
        <MetricCard title="Behavior Analysis" icon={Activity} metric={analysis.behavior} />
      </div>

      {/* Risk Warning */}
      {analysis.overall_score < 80 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r">
          <div className="flex">
            <AlertTriangle className="h-6 w-6 text-yellow-400 mr-2" />
            <p className="text-sm text-yellow-700">Security concerns detected. Review recommended before deployment.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityAnalysis;
