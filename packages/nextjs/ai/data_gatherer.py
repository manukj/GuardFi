import json
from typing import List, Dict
import re

def analyze_contract_metrics(code: str) -> Dict:
    """Analyze contract code to extract security metrics"""
    metrics = {
        'lines_of_code': len(code.split('\n')),
        'external_calls': len(re.findall(r'\.(call|delegatecall|staticcall)', code)),
        'nested_depth': max(line.count('{') for line in code.split('\n')),
        'is_upgradeable': bool(re.search(r'(upgradeable|proxy)', code.lower())),
        'vulnerabilities': [],
        'audit_score': 0.0
    }
    
    # Add security checks
    if 'selfdestruct' in code:
        metrics['vulnerabilities'].append('contains_selfdestruct')
    if not re.search(r'require\(|assert\(', code):
        metrics['vulnerabilities'].append('no_input_validation')
    if 'tx.origin' in code:
        metrics['vulnerabilities'].append('uses_tx_origin')
    if '.call{value:' in code and not 'ReentrancyGuard' in code:
        metrics['vulnerabilities'].append('potential_reentrancy')
    
    return metrics

def create_training_data(contracts: List[Dict[str, str]]) -> List[Dict]:
    """Create training data from a list of contracts"""
    training_data = []
    
    for contract in contracts:
        metrics = analyze_contract_metrics(contract['code'])
        
        # Create conversation format
        conversation = {
            "conversations": [
                {
                    "role": "user",
                    "content": f"Analyze this smart contract:\n{contract['code']}"
                },
                {
                    "role": "assistant",
                    "content": f"Security Analysis Score: {7.5 if len(metrics['vulnerabilities']) == 0 else 5.0}/10\n\n"
                             f"Metrics:\n"
                             f"- Complexity: {'High' if metrics['lines_of_code'] > 100 else 'Medium' if metrics['lines_of_code'] > 50 else 'Low'}\n"
                             f"- External Calls: {metrics['external_calls']}\n"
                             f"- Nesting Depth: {metrics['nested_depth']}\n"
                             f"- Vulnerabilities: {', '.join(metrics['vulnerabilities']) if metrics['vulnerabilities'] else 'None detected'}"
                }
            ],
            "metadata": {
                "code_metrics": metrics
            }
        }
        
        training_data.append(conversation)
    
    return training_data

if __name__ == "__main__":
    # Example contracts
    contracts = [
        {
            "code": """
contract SimpleStorage {
    uint256 storedData;
    function set(uint256 x) public {
        storedData = x;
    }
    function get() public view returns (uint256) {
        return storedData;
    }
}
            """
        },
        {
            "code": """
contract UnsafeBank {
    mapping(address => uint) public balances;
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    function withdraw(uint _amount) public {
        require(balances[msg.sender] >= _amount);
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Transfer failed");
        balances[msg.sender] -= _amount;
    }
}
            """
        },
        {
            "code": """
contract SecureToken is ERC20, ReentrancyGuard {
    using SafeMath for uint256;
    
    uint256 public maxTransactionAmount;
    mapping(address => bool) public blacklisted;
    
    constructor() {
        maxTransactionAmount = totalSupply().div(100); // 1%
    }
    
    function transfer(address recipient, uint256 amount) 
        public 
        nonReentrant 
        returns (bool) 
    {
        require(!blacklisted[msg.sender], "Blacklisted");
        require(amount <= maxTransactionAmount, "Exceeds limit");
        return super.transfer(recipient, amount);
    }
}
            """
        },
        {
            "code": """
contract DangerousProxy {
    address public implementation;
    
    constructor(address _implementation) {
        implementation = _implementation;
    }
    
    fallback() external payable {
        address impl = implementation;
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }
}
            """
        },
        {
            "code": """
contract SelfDestructable {
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    function destroy() public {
        require(msg.sender == owner);
        selfdestruct(payable(owner));
    }
}
            """
        }
    ]
    
    # Create training data
    training_data = create_training_data(contracts)
    
    # Save to demo_data.jsonl
    print("Creating demo_data.jsonl with training examples...")
    with open('demo_data.jsonl', 'w') as f:
        for item in training_data:
            f.write(json.dumps(item) + '\n')
    print("Finished! Created training data with", len(contracts), "contracts")
    
    # Print sample of what was created
    print("\nSample analysis of first contract:")
    print(json.dumps(training_data[0], indent=2))