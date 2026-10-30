const analyzeComplexity = (code) => {

    const forLoops =
        (code.match(/for\s*\(/g) || []).length;

    const whileLoops =
        (code.match(/while\s*\(/g) || []).length;

    const totalLoops =
        forLoops + whileLoops;

    let time = "O(1)";
    let reason = "Constant number of operations.";

    if (
        code.includes("binary search") ||
        (
            code.includes("low") &&
            code.includes("high") &&
            code.includes("mid")
        )
    ) {

        time = "O(log n)";
        reason =
            "The search space is repeatedly divided in half.";

    }
    else if (totalLoops >= 2) {

        time = "O(n²)";
        reason =
            "The code contains nested/multiple loops.";

    }
    else if (totalLoops === 1) {

        time = "O(n)";
        reason =
            "The program processes elements linearly.";

    }

    return {
        timeComplexity: time,
        spaceComplexity: "O(1)",
        reason
    };
};

module.exports = {
    analyzeComplexity
};