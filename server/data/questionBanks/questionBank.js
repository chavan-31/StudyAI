const questionBank = {
  Java: {
    Arrays: {
      Beginner: [],
      Intermediate: [],
      Advanced: [],
    },

    OOP: {
      Beginner: [],
      Intermediate: [],
      Advanced: [],
    },

    Basics: {
      Beginner: [
        {
          question: "Which keyword is used to define a class in Java?",
          options: ["class", "Class", "define", "struct"],
          correctAnswer: "class",
          explanation: "The class keyword declares a class in Java.",
        },
        {
          question:
            "Which method is the entry point of a standard Java application?",
          options: ["start()", "main()", "run()", "init()"],
          correctAnswer: "main()",
          explanation:
            "The main method is the standard entry point of a Java application.",
        },
        {
          question: "Which data type stores whole numbers in Java?",
          options: ["float", "boolean", "int", "char"],
          correctAnswer: "int",
          explanation:
            "The int primitive type stores 32-bit signed whole numbers.",
        },
        {
          question: "Which keyword creates an object in Java?",
          options: ["make", "new", "create", "object"],
          correctAnswer: "new",
          explanation:
            "The new keyword creates an object and invokes its constructor.",
        },
        {
          question: "Which symbol terminates most Java statements?",
          options: [".", ":", ";", ","],
          correctAnswer: ";",
          explanation: "A semicolon terminates most Java statements.",
        },
        {
          question: "Which of these is a primitive data type in Java?",
          options: ["String", "Integer", "boolean", "Scanner"],
          correctAnswer: "boolean",
          explanation: "boolean is a primitive type that stores true or false.",
        },
        {
          question: "What is the default value of an int instance variable?",
          options: ["null", "0", "1", "-1"],
          correctAnswer: "0",
          explanation:
            "Instance variables of type int are initialized to zero.",
        },
        {
          question: "Which keyword declares a constant-like variable in Java?",
          options: ["static", "const", "final", "fixed"],
          correctAnswer: "final",
          explanation: "A final variable can be assigned only once.",
        },
        {
          question: "Which operator is used for addition in Java?",
          options: ["+", "*", "/", "%"],
          correctAnswer: "+",
          explanation: "The plus operator performs numeric addition.",
        },
        {
          question: "Which statement displays text in the console?",
          options: [
            "System.out.println()",
            "Console.write()",
            "print.console()",
            "echo()",
          ],
          correctAnswer: "System.out.println()",
          explanation:
            "System.out.println() prints text followed by a newline.",
        },
        {
          question: "Which data type stores a single character?",
          options: ["String", "char", "byte", "CharacterArray"],
          correctAnswer: "char",
          explanation: "The char primitive type stores one UTF-16 code unit.",
        },
        {
          question: "Which keyword is used to make a decision in Java?",
          options: ["for", "if", "class", "import"],
          correctAnswer: "if",
          explanation:
            "The if statement executes a block when its condition is true.",
        },
        {
          question: "Which loop executes its body at least once?",
          options: ["for", "while", "do-while", "enhanced for"],
          correctAnswer: "do-while",
          explanation:
            "A do-while loop checks its condition after executing the body.",
        },
        {
          question: "Which operator checks equality between primitive values?",
          options: ["=", "==", "!=", "equals"],
          correctAnswer: "==",
          explanation:
            "The == operator compares primitive values for equality.",
        },
        {
          question: "Which keyword exits a loop immediately?",
          options: ["stop", "exit", "break", "continue"],
          correctAnswer: "break",
          explanation:
            "The break statement terminates the nearest enclosing loop.",
        },
        {
          question: "Which keyword skips the current loop iteration?",
          options: ["skip", "continue", "break", "return"],
          correctAnswer: "continue",
          explanation:
            "continue skips the remaining statements in the current iteration.",
        },
        {
          question: "Which package is imported automatically in Java?",
          options: ["java.util", "java.io", "java.lang", "java.net"],
          correctAnswer: "java.lang",
          explanation:
            "Types in java.lang are available without an explicit import.",
        },
        {
          question: "What is the size of the Java int primitive type?",
          options: ["8 bits", "16 bits", "32 bits", "64 bits"],
          correctAnswer: "32 bits",
          explanation: "Java int is a 32-bit signed integer type.",
        },
        {
          question: "Which keyword refers to the current object?",
          options: ["self", "this", "current", "super"],
          correctAnswer: "this",
          explanation: "this refers to the current object instance.",
        },
        {
          question: "Which method parses an integer from a String?",
          options: [
            "Integer.parseInt()",
            "String.toInt()",
            "Integer.value()",
            "parse.Integer()",
          ],
          correctAnswer: "Integer.parseInt()",
          explanation:
            "Integer.parseInt() parses a numeric String into a primitive int.",
        },
      ],

      Intermediate: [
        {
          question:
            "What is the output of int x = 10; System.out.println(x++);?",
          options: ["10", "11", "9", "Compilation error"],
          correctAnswer: "10",
          explanation:
            "Post-increment returns the current value before incrementing x.",
        },
        {
          question: "What is the result of 10 / 3 when both operands are int?",
          options: ["3", "3.33", "4", "3.0"],
          correctAnswer: "3",
          explanation: "Integer division discards the fractional part.",
        },
        {
          question:
            "Which conversion happens automatically when an int is assigned to a long?",
          options: ["Narrowing", "Widening", "Casting required", "Parsing"],
          correctAnswer: "Widening",
          explanation:
            "A long can represent every int value, so widening happens automatically.",
        },
        {
          question: 'What is the output of System.out.println(5 + 2 + "Java")?',
          options: ["52Java", "7Java", "Java7", "Compilation error"],
          correctAnswer: "7Java",
          explanation:
            "Addition happens first, followed by String concatenation.",
        },
        {
          question: "Which operator uses short-circuit logical AND?",
          options: ["&", "&&", "|", "^"],
          correctAnswer: "&&",
          explanation:
            "&& evaluates the right operand only when the left operand is true.",
        },
        {
          question: "What does 17 % 5 return?",
          options: ["2", "3", "5", "0"],
          correctAnswer: "2",
          explanation: "The remainder after dividing 17 by 5 is 2.",
        },
        {
          question: "What is the default value of a boolean instance variable?",
          options: ["true", "false", "null", "0"],
          correctAnswer: "false",
          explanation: "Java initializes boolean instance variables to false.",
        },
        {
          question:
            "Which access modifier allows access from anywhere the declaring type is accessible?",
          options: ["private", "protected", "public", "default"],
          correctAnswer: "public",
          explanation:
            "A public member is accessible wherever its declaring type is accessible.",
        },
        {
          question:
            "What happens when break is executed inside a switch statement?",
          options: [
            "The program terminates",
            "The switch is exited",
            "The next case executes",
            "The loop restarts",
          ],
          correctAnswer: "The switch is exited",
          explanation:
            "break terminates the nearest enclosing switch statement.",
        },
        {
          question:
            "Which loop is generally suitable when the number of iterations is known?",
          options: ["for", "while", "do-while", "switch"],
          correctAnswer: "for",
          explanation:
            "A for loop groups initialization, condition and update.",
        },
        {
          question:
            'What is the output of System.out.println("Java".length())?',
          options: ["3", "4", "5", "Compilation error"],
          correctAnswer: "4",
          explanation: "The String contains four UTF-16 code units.",
        },
        {
          question: "Which method compares the contents of two Strings?",
          options: ["==", "compare", "equals()", "same()"],
          correctAnswer: "equals()",
          explanation:
            "String.equals() compares character sequences, while == compares references.",
        },
        {
          question: "What is the result of true || false?",
          options: ["true", "false", "0", "Compilation error"],
          correctAnswer: "true",
          explanation:
            "Logical OR returns true when at least one operand is true.",
        },
        {
          question: "Which statement imports a class from another package?",
          options: ["include", "using", "import", "package"],
          correctAnswer: "import",
          explanation:
            "An import declaration allows a type to be referred to by its simple name.",
        },
        {
          question:
            "What is the output of int a = 5; a += 3; System.out.println(a);?",
          options: ["5", "3", "8", "15"],
          correctAnswer: "8",
          explanation: "The compound assignment adds 3 to the existing value.",
        },
        {
          question: "Which keyword prevents a class from being subclassed?",
          options: ["static", "final", "private", "abstract"],
          correctAnswer: "final",
          explanation: "A final class cannot be extended.",
        },
        {
          question: "When does the default branch of a switch execute?",
          options: [
            "Always first",
            "When no case matches",
            "After every case",
            "Only for integers",
          ],
          correctAnswer: "When no case matches",
          explanation:
            "The default branch handles values not matched by another case.",
        },
        {
          question: "What is the type of the expression 5 / 2.0?",
          options: ["int", "float", "double", "long"],
          correctAnswer: "double",
          explanation: "The double operand causes binary numeric promotion.",
        },
        {
          question: "What does continue do inside a loop?",
          options: [
            "Exits the loop",
            "Skips to the next iteration",
            "Restarts the program",
            "Exits the method",
          ],
          correctAnswer: "Skips to the next iteration",
          explanation:
            "continue skips the remaining body statements for the current iteration.",
        },
        {
          question: "Which method converts an integer into a String?",
          options: [
            "Integer.toString()",
            "Integer.parseInt()",
            "String.toInteger()",
            "int.parse()",
          ],
          correctAnswer: "Integer.toString()",
          explanation:
            "Integer.toString() returns a String representation of an integer.",
        },
      ],

      Advanced: [],
    },

    Strings: {
      Beginner: [],
      Intermediate: [],
      Advanced: [],
    },

    Collections: {
      Beginner: [],
      Intermediate: [],
      Advanced: [],
    },

    "Exception Handling": {
      Beginner: [],
      Intermediate: [],
      Advanced: [],
    },
  },

  Python: {},
  JavaScript: {},
  C: {},
  "C++": {},
};

module.exports = questionBank;
