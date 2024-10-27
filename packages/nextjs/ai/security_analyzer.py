# ai/security_analyzer.py
import sys
import json
import re
from transformers import AutoTokenizer, AutoModelForCausalLM

class SecurityAnalyzer:
    def __init__(self):
        self.model_name = "magentoooo/task-13-Qwen-Qwen1.5-0.5B"
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModelForCausalLM.from_pretrained(self.model_name)

    def calculate_complexity_score(self, lines_count: int, external_calls: int, nesting_depth: int) -> int:
        """Calculate complexity score based on code metrics"""
        # Penalize for excessive lines of code
        loc_score = 100 - min(lines_count / 10, 50)  # -50 points max for LOC
        
        # Penalize for external calls
        calls_score = 100 - (external_calls * 10)  # -10 points per external call
        
        # Penalize for deep nesting
        nesting_score = 100 - (nesting_depth * 15)  # -15 points per nesting level
        
        # Calculate weighted average
        final_score = (loc_score * 0.4 + calls_score * 0.3 + nesting_score * 0.3)
        
        # Ensure score is between 0 and 100
        return max(0, min(100, final_score))

    def analyze_complexity(self, code: str) -> dict:
        lines = code.split('\n')
        external_calls = len(re.findall(r'\.(call|delegatecall|staticcall)', code))
        nesting_depth = max(line.count('{') for line in lines)
        
        score = self.calculate_complexity_score(len(lines), external_calls, nesting_depth)
        risk_level = "Low" if score >= 80 else "Medium" if score >= 60 else "High"
        
        return {
            "score": score,
            "details": [
                f"Lines of Code: {len(lines)}",
                f"External Calls: {external_calls}",
                f"Maximum Nesting Depth: {nesting_depth}"
            ],
            "risk_level": risk_level
        }

    def calculate_vulnerability_score(self, vulnerabilities: list) -> int:
        """Calculate vulnerability score based on found issues"""
        base_score = 100
        
        # Deduct points for each vulnerability
        deductions = {
            "reentrancy": 30,
            "selfdestruct": 25,
            "unchecked_external_call": 20,
            "tx_origin": 15,
            "integer_overflow": 15,
            "unprotected_functions": 10
        }
        
        for vuln in vulnerabilities:
            for key, deduction in deductions.items():
                if key in vuln.lower():
                    base_score -= deduction
        
        return max(0, base_score)

    def analyze_vulnerabilities(self, code: str) -> dict:
        vulnerabilities = []
        
        # Check for common vulnerabilities
        if 'selfdestruct' in code:
            vulnerabilities.append("Contains selfdestruct - high risk")
        if '.call.value' in code and 'nonReentrant' not in code:
            vulnerabilities.append("Potential reentrancy vulnerability")
        if 'tx.origin' in code:
            vulnerabilities.append("Unsafe use of tx.origin")
        if not re.search(r'require\(|assert\(', code):
            vulnerabilities.append("Missing input validation")
        
        score = self.calculate_vulnerability_score(vulnerabilities)
        risk_level = "Low" if score >= 80 else "Medium" if score >= 60 else "High"
        
        return {
            "score": score,
            "details": vulnerabilities if vulnerabilities else ["No major vulnerabilities detected"],
            "risk_level": risk_level
        }

    def analyze_all(self, code: str) -> dict:
        # Get individual analyses
        complexity = self.analyze_complexity(code)
        vulnerabilities = self.analyze_vulnerabilities(code)
        
        # Calculate overall score (weighted average)
        overall_score = round(
            complexity["score"] * 0.3 +  # 30% weight for complexity
            vulnerabilities["score"] * 0.7  # 70% weight for vulnerabilities
        )
        
        return {
            "overall_score": overall_score,
            "complexity": complexity,
            "vulnerabilities": vulnerabilities,
            "recommendations": self.generate_recommendations(complexity, vulnerabilities)
        }

    def generate_recommendations(self, complexity: dict, vulnerabilities: dict) -> list:
        """Generate recommendations based on analysis results"""
        recommendations = []
        
        # Complexity recommendations
        if complexity["score"] < 80:
            if "Lines of Code" in str(complexity["details"]):
                recommendations.append("Consider breaking down the contract into smaller, more manageable components")
            if "External Calls" in str(complexity["details"]):
                recommendations.append("Minimize external calls to reduce attack surface")
            if "Nesting Depth" in str(complexity["details"]):
                recommendations.append("Reduce code nesting to improve readability and auditability")
        
        # Vulnerability recommendations
        if "reentrancy" in str(vulnerabilities["details"]).lower():
            recommendations.append("Implement ReentrancyGuard and follow checks-effects-interactions pattern")
        if "selfdestruct" in str(vulnerabilities["details"]).lower():
            recommendations.append("Remove or secure selfdestruct functionality")
        if "tx.origin" in str(vulnerabilities["details"]).lower():
            recommendations.append("Use msg.sender instead of tx.origin")
        
        return recommendations

def main():
    if len(sys.argv) != 2:
        print("Usage: python security_analyzer.py <contract_file>")
        sys.exit(1)
        
    with open(sys.argv[1], 'r') as f:
        code = f.read()
    
    analyzer = SecurityAnalyzer()
    result = analyzer.analyze_all(code)
    print(json.dumps(result))

if __name__ == "__main__":
    main()