# ai/security_analyzer.py
import sys
import json
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
import re
import os

class SecurityAnalyzer:
    def __init__(self):
        try:
            self.model_name = "Qwen/Qwen1.5-0.5B"
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name, trust_remote_code=True)
            self.model = AutoModelForCausalLM.from_pretrained(self.model_name, torch_dtype=torch.float32, trust_remote_code=True)
        except Exception as e:
            print(f"Model loading error: {str(e)}")
            raise

    def analyze_contract(self, code: str) -> dict:
        # Static Analysis
        static_metrics = self._static_analysis(code)
        
        # AI Analysis
        ai_analysis = self._ai_analysis(code)
        
        # Combine analyses
        combined_score = self._calculate_final_score(static_metrics, ai_analysis)
        
        return {
            "overall_score": combined_score,
            "complexity": {
                "score": static_metrics["complexity_score"],
                "details": [
                    f"Lines of Code: {static_metrics['loc']}",
                    f"External Calls: {static_metrics['external_calls']}",
                    f"Nesting Depth: {static_metrics['nesting_depth']}",
                    f"State Variables: {static_metrics['state_variables']}",
                ],
                "risk_level": self._get_risk_level(static_metrics["complexity_score"])
            },
            "vulnerabilities": {
                "score": ai_analysis["security_score"],
                "details": ai_analysis["vulnerabilities"],
                "risk_level": self._get_risk_level(ai_analysis["security_score"])
            },
            "upgradability": {
                "score": static_metrics["upgradability_score"],
                "details": static_metrics["upgradability_details"],
                "risk_level": self._get_risk_level(static_metrics["upgradability_score"])
            },
            "behavior": {
                "score": static_metrics["behavior_score"],
                "details": static_metrics["behavior_details"],
                "risk_level": self._get_risk_level(static_metrics["behavior_score"])
            }
        }

    def _static_analysis(self, code: str) -> dict:
        # Basic metrics
        loc = len(code.split('\n'))
        external_calls = len(re.findall(r'\.(call|delegatecall|staticcall)', code))
        nesting_depth = max(line.count('{') for line in code.split('\n'))
        state_variables = len(re.findall(r'^\s*(uint|int|bool|address|string|bytes|mapping)', code, re.MULTILINE))
        
        # Upgradability check
        is_upgradeable = 'upgradeable' in code.lower() or 'proxy' in code.lower()
        has_owner = 'owner' in code.lower()
        
        # Behavior analysis
        has_reentrancy_guard = 'nonReentrant' in code
        has_access_control = 'onlyOwner' in code or 'require(msg.sender ==' in code
        
        # Calculate scores
        complexity_score = 100 - (
            min(50, loc/10) +  # -5 points per 10 lines
            (external_calls * 10) +  # -10 points per external call
            (nesting_depth * 5) +  # -5 points per nesting level
            (state_variables * 2)  # -2 points per state variable
        )
        
        upgradability_score = 100
        if is_upgradeable:
            upgradability_score -= 30  # Major deduction for upgradeability
        if not has_access_control and has_owner:
            upgradability_score -= 20  # Deduction for poor access control
            
        behavior_score = 80
        if not has_reentrancy_guard and external_calls > 0:
            behavior_score -= 30
        if not has_access_control:
            behavior_score -= 20
            
        return {
            "loc": loc,
            "external_calls": external_calls,
            "nesting_depth": nesting_depth,
            "state_variables": state_variables,
            "complexity_score": max(0, min(100, complexity_score)),
            "upgradability_score": max(0, min(100, upgradability_score)),
            "upgradability_details": [
                f"Upgradeable: {'Yes' if is_upgradeable else 'No'}",
                f"Access Control: {'Yes' if has_access_control else 'No'}",
            ],
            "behavior_score": max(0, min(100, behavior_score)),
            "behavior_details": [
                f"Reentrancy Protection: {'Yes' if has_reentrancy_guard else 'No'}",
                f"Access Controls: {'Yes' if has_access_control else 'No'}",
            ]
        }

    def _ai_analysis(self, code: str) -> dict:
        prompt = f"Analyze this smart contract:\n\n{code}\n\nSecurity Analysis:"
        
        inputs = self.tokenizer(prompt, return_tensors="pt", max_length=512, truncation=True)
        outputs = self.model.generate(
            **inputs,
            max_length=1024,
            do_sample=True,
            temperature=0.7,
            num_return_sequences=1
        )
        
        analysis = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        # Parse vulnerabilities
        vulnerabilities = []
        security_score = 100
        
        for line in analysis.split('\n'):
            if 'vulnerability' in line.lower() or 'risk' in line.lower():
                vulnerabilities.append(line.strip())
                security_score -= 10  # Deduct points for each vulnerability
                
        return {
            "security_score": max(0, min(100, security_score)),
            "vulnerabilities": vulnerabilities if vulnerabilities else ["No major vulnerabilities detected"]
        }

    def _calculate_final_score(self, static_metrics: dict, ai_analysis: dict) -> int:
        weights = {
            "complexity": 0.3,
            "security": 0.4,
            "upgradability": 0.15,
            "behavior": 0.15
        }
        
        final_score = (
            static_metrics["complexity_score"] * weights["complexity"] +
            ai_analysis["security_score"] * weights["security"] +
            static_metrics["upgradability_score"] * weights["upgradability"] +
            static_metrics["behavior_score"] * weights["behavior"]
        )
        
        return round(max(0, min(100, final_score)))

    def _get_risk_level(self, score: float) -> str:
        if score >= 80:
            return "Low"
        elif score >= 60:
            return "Medium"
        return "High"

def main():
    if len(sys.argv) != 2:
        print("Usage: python security_analyzer.py <contract_file>")
        sys.exit(1)
    
    try:
        with open(sys.argv[1], 'r') as f:
            code = f.read()
        
        analyzer = SecurityAnalyzer()
        result = analyzer.analyze_contract(code)
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({
            "overall_score": 0,
            "complexity": {"score": 0, "details": [str(e)], "risk_level": "High"},
            "vulnerabilities": {"score": 0, "details": [str(e)], "risk_level": "High"},
            "upgradability": {"score": 0, "details": [str(e)], "risk_level": "High"},
            "behavior": {"score": 0, "details": [str(e)], "risk_level": "High"}
        }))
        sys.exit(1)

if __name__ == "__main__":
    main()