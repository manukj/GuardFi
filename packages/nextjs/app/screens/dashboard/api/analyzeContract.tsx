import axios from "axios";

// import exp from 'constants';

const mockAnalysis = [
  {
    function: "withdraw()",
    risk: 5,
    description:
      "Reentrancy vulnerability. The contract updates the user's balance after transferring funds, allowing a malicious contract to re-enter the function and withdraw more than intended.",
    recommendation:
      "Use the Checks-Effects-Interactions pattern by updating the user's balance before the external call, or use a reentrancy guard.",
  },
  {
    function: "execute()",
    risk: 4,
    description:
      "Unchecked external call. The contract makes an external call using `call` without checking for success, which could result in unintended behavior or vulnerabilities.",
    recommendation: "Check the return value of the `call` function to ensure that the external call was successful.",
  },
  {
    function: "setWithdrawLimit()",
    risk: 3,
    description:
      "Unrestricted write access. Anyone can call this function and change the withdrawal limit, which could allow malicious users to set an undesirably high or low limit.",
    recommendation: "Restrict this function to the owner using `require(msg.sender == owner)`.",
  },
  {
    function: "riskyAddition()",
    risk: 2,
    description:
      "Potential integer overflow/underflow. Although this is mitigated in Solidity 0.8.0+, older versions are vulnerable.",
    recommendation:
      "Ensure that the contract is compiled with Solidity 0.8.0+ or use a SafeMath library for older versions.",
  },
  {
    function: "distributeFunds()",
    risk: 4,
    description:
      "Denial of Service (DoS) with gas limit. If the recipients array is too large, the loop could run out of gas and prevent further execution.",
    recommendation:
      "Consider using a pull-based pattern where users claim their funds instead of iterating over all recipients in a single transaction.",
  },
  {
    function: "withdrawAll()",
    risk: 4,
    description:
      "Missing timelock for large withdrawals. The contract allows the owner to withdraw all funds immediately, posing a risk of sudden fund depletion.",
    recommendation: "Implement a timelock mechanism or a delay for large withdrawals to allow time for users to react.",
  },
];
const analyzeContract = async (contractContent: string) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API request delay
    return mockAnalysis;
    const apiUrl = "https://api.openai.com/v1/chat/completions";
    const apiKey =
      "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"; // Replace with your actual API key

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };

    // Constructing the prompt to ask for a JSON response
    const requestBody = {
      model: "gpt-4", // Specify the model you want to use (e.g., gpt-4 or gpt-3.5-turbo)
      messages: [
        {
          role: "user",
          content: `Analyze the following Solidity smart contract code for vulnerabilities and provide a list of vulnerabilities in JSON format. Each item in the list should include the function name, risk level (1-5), description of the issue, and recommendations. Here is the code:
          
          \`\`\`solidity
          ${contractContent}
          \`\`\`

          Respond with the vulnerabilities in the following JSON format:

          [
            {
              "function": "function_name",
              "risk": risk_level (1-5),
              "description": "description_of_the_issue",
              "recommendation": "recommendation_to_fix_the_issue"
            },
            ...
          ]
          `,
        },
      ],
      temperature: 0.2, // Lower temperature for more focused output
    };

    // Sending the POST request to OpenAI's API
    const { data } = await axios.post(apiUrl, requestBody, { headers });

    // Parse and handle the response
    const jsonResponse = data.choices[0].message.content;

    // Attempt to parse JSON if it's returned as a string
    try {
      const parsedResponse = JSON.parse(jsonResponse);
      console.log("Parsed Vulnerabilities:", parsedResponse);
      return parsedResponse;
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return jsonResponse; // If parsing fails, return the raw response
    }
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
};

export default analyzeContract;

export { mockAnalysis };
