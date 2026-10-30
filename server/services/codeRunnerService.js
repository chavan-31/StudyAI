const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFile } = require("child_process");


// ==========================================
// RUN JAVA CODE
// ==========================================

const runJavaCode = (code) => {

    return new Promise((resolve) => {

        const tempDir = fs.mkdtempSync(
            path.join(os.tmpdir(), "studyai-")
        );

        const javaFile =
            path.join(tempDir, "Main.java");


        // ==========================================
        // CLEANUP
        // ==========================================

        const cleanup = () => {

            try {

                fs.rmSync(
                    tempDir,
                    {
                        recursive: true,
                        force: true
                    }
                );

            }
            catch (error) {

                console.error(
                    "Cleanup Error:",
                    error.message
                );

            }
        };


        try {

            // ==========================================
            // SAVE JAVA FILE
            // ==========================================

            fs.writeFileSync(
                javaFile,
                code,
                "utf8"
            );


            console.log(
                "Java file created:"
            );

            console.log(
                javaFile
            );


            // ==========================================
            // COMPILE
            // ==========================================

            execFile(
                "javac",
                [javaFile],
                {
                    timeout: 10000
                },

                (
                    compileError,
                    stdout,
                    stderr
                ) => {

                    if (compileError) {

                        cleanup();

                        return resolve({
                            success: false,
                            type: "compile",
                            output:
                                stderr ||
                                compileError.message
                        });
                    }


                    console.log(
                        "Java compilation successful"
                    );


                    // ==========================================
                    // RUN PROGRAM
                    // ==========================================

                    execFile(
                        "java",

                        [
                            "-cp",
                            tempDir,
                            "Main"
                        ],

                        {
                            timeout: 5000
                        },

                        (
                            runError,
                            output,
                            runStderr
                        ) => {

                            cleanup();


                            // ==========================================
                            // RUNTIME ERROR
                            // ==========================================

                            if (runError) {

                                return resolve({

                                    success: false,

                                    type: "runtime",

                                    output:
                                        runStderr ||
                                        runError.message

                                });

                            }


                            // ==========================================
                            // SUCCESS
                            // ==========================================

                            return resolve({

                                success: true,

                                type: "output",

                                output:
                                    output ||
                                    "Program executed successfully with no output."

                            });

                        }
                    );

                }
            );

        }

        catch (error) {

            cleanup();

            return resolve({

                success: false,

                type: "system",

                output: error.message

            });

        }

    });
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
    runJavaCode
};