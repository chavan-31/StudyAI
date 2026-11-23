const javaQuestionBank = {
  Arrays: {
    Beginner: [
      {
        question: "Which index does the first element of a Java array use?",
        options: ["0", "1", "-1", "2"],
        correctAnswer: "0",
        explanation: "Java arrays use zero-based indexing.",
      },
      {
        question: "Which keyword creates an integer array?",
        options: ["int[]", "array", "integer", "list"],
        correctAnswer: "int[]",
        explanation: "int[] declares an array of integers.",
      },
      {
        question:
          "What is the index of the last element in an array of length 5?",
        options: ["4", "5", "3", "6"],
        correctAnswer: "4",
        explanation: "The last index is length minus one.",
      },
      {
        question: "Which property returns the size of an array?",
        options: ["length", "size()", "count", "capacity()"],
        correctAnswer: "length",
        explanation: "Java arrays expose their size through the length field.",
      },
      {
        question: "Which symbol is used to access an array element?",
        options: ["[]", "()", "{}", "<>"],
        correctAnswer: "[]",
        explanation: "Square brackets access array elements.",
      },
    ],
    Intermediate: [
      {
        question:
          "What happens when accessing index 5 in an array of length 5?",
        options: [
          "ArrayIndexOutOfBoundsException",
          "Returns 0",
          "Returns null",
          "Compilation error",
        ],
        correctAnswer: "ArrayIndexOutOfBoundsException",
        explanation: "Valid indexes range from 0 to 4.",
      },
      {
        question: "What is the default value of an int array element?",
        options: ["0", "null", "1", "-1"],
        correctAnswer: "0",
        explanation: "Integer array elements default to zero.",
      },
    ],
    Advanced: [
      {
        question:
          "What is the time complexity of accessing an array element by index?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
        correctAnswer: "O(1)",
        explanation: "Array indexing provides constant-time access.",
      },
    ],
  },

  OOP: {
    Beginner: [
      {
        question: "What does OOP stand for?",
        options: [
          "Object-Oriented Programming",
          "Open Object Process",
          "Operational Output Programming",
          "Ordered Operating Procedure",
        ],
        correctAnswer: "Object-Oriented Programming",
        explanation: "OOP organizes software around objects and classes.",
      },
    ],
    Intermediate: [
      {
        question: "Which keyword is used to inherit a class in Java?",
        options: ["extends", "implements", "inherits", "super"],
        correctAnswer: "extends",
        explanation: "A class uses extends to inherit another class.",
      },
    ],
    Advanced: [
      {
        question:
          "Which concept allows one interface to have multiple implementations?",
        options: [
          "Polymorphism",
          "Encapsulation",
          "Compilation",
          "Serialization",
        ],
        correctAnswer: "Polymorphism",
        explanation:
          "Polymorphism allows different implementations through a common type.",
      },
    ],
  },

  Basics: {
    Beginner: [
      {
        question:
          "Which method is the entry point of a standard Java application?",
        options: ["main()", "start()", "run()", "init()"],
        correctAnswer: "main()",
        explanation:
          "The main method is the conventional application entry point.",
      },
    ],
    Intermediate: [
      {
        question: "Which keyword prevents a variable from being reassigned?",
        options: ["final", "static", "const", "fixed"],
        correctAnswer: "final",
        explanation: "A final variable can be assigned only once.",
      },
    ],
    Advanced: [
      {
        question: "Which Java feature enables automatic memory reclamation?",
        options: [
          "Garbage collection",
          "Method overloading",
          "Inheritance",
          "Packages",
        ],
        correctAnswer: "Garbage collection",
        explanation:
          "The garbage collector reclaims memory occupied by unreachable objects.",
      },
    ],
  },

  Strings: {
    Beginner: [
      {
        question: "Which class represents an immutable sequence of characters?",
        options: ["String", "StringBuilder", "StringBuffer", "CharacterArray"],
        correctAnswer: "String",
        explanation: "String objects are immutable in Java.",
      },
    ],
    Intermediate: [
      {
        question: "Which method compares the contents of two strings?",
        options: ["equals()", "==", "compareRef()", "same()"],
        correctAnswer: "equals()",
        explanation: "equals() compares string contents.",
      },
    ],
    Advanced: [
      {
        question:
          "Which class is generally preferred for mutable strings in single-threaded code?",
        options: ["StringBuilder", "String", "Integer", "Character"],
        correctAnswer: "StringBuilder",
        explanation:
          "StringBuilder supports mutable strings without synchronization overhead.",
      },
    ],
  },

  Collections: {
    Beginner: [
      {
        question: "Which collection stores unique elements?",
        options: ["Set", "List", "ArrayList", "Vector"],
        correctAnswer: "Set",
        explanation: "A Set does not permit duplicate elements.",
      },
    ],
    Intermediate: [
      {
        question: "Which interface provides key-value mapping?",
        options: ["Map", "List", "Queue", "Set"],
        correctAnswer: "Map",
        explanation: "Map stores values associated with unique keys.",
      },
    ],
    Advanced: [
      {
        question:
          "Which collection commonly provides average O(1) lookup by key?",
        options: ["HashMap", "TreeMap", "ArrayList", "LinkedList"],
        correctAnswer: "HashMap",
        explanation:
          "HashMap provides average constant-time key lookup under normal hashing conditions.",
      },
    ],
  },

  "Exception Handling": {
    Beginner: [
      {
        question: "Which block handles an exception in Java?",
        options: ["catch", "throw", "final", "static"],
        correctAnswer: "catch",
        explanation:
          "The catch block handles exceptions thrown from the associated try block.",
      },
    ],
    Intermediate: [
      {
        question:
          "Which block normally executes whether an exception occurs or not?",
        options: ["finally", "catch", "throw", "throws"],
        correctAnswer: "finally",
        explanation:
          "The finally block normally executes after try/catch processing.",
      },
    ],
    Advanced: [
      {
        question:
          "Which category must normally be caught or declared by a method?",
        options: [
          "Checked exceptions",
          "Errors only",
          "All RuntimeExceptions",
          "No exceptions",
        ],
        correctAnswer: "Checked exceptions",
        explanation:
          "Checked exceptions must be caught or declared, subject to Java's exception rules.",
      },
    ],
  },
};

module.exports = javaQuestionBank;
