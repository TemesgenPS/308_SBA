// The provided course information.
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
};

// The provided assignment group.
const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
        {
            id: 1,
            name: "Declare a Variable",
            due_at: "2023-01-25",
            points_possible: 50
        },
        {
            id: 2,
            name: "Write a Function",
            due_at: "2023-02-27",
            points_possible: 150
        },
        {
            id: 3,
            name: "Code the World",
            due_at: "3156-11-15",
            points_possible: 500
        }
    ]
};

// The provided learner submission data.
const LearnerSubmissions = [
    {
        learner_id: 125,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-25",
            score: 47
        }
    },
    {
        learner_id: 125,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-02-12",
            score: 150
        }
    },
    {
        learner_id: 125,
        assignment_id: 3,
        submission: {
            submitted_at: "2023-01-25",
            score: 400
        }
    },
    {
        learner_id: 132,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-24",
            score: 39
        }
    },
    {
        learner_id: 132,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-03-07",
            score: 140
        }
    }
];

function getLearnerData(course, ag, submissions) {
    // TEST: verify function is running
    /*
    console.log("Function started");
     */
    try {
        if (ag.course_id !== course.id) {
            throw new Error("AssignmentGroup does not belong to this course");
        }

        const learnerMap = {};

        // Group submissions by learner
        for (const sub of submissions) {
            if (!learnerMap[sub.learner_id]) {
                learnerMap[sub.learner_id] = [];
            }
            learnerMap[sub.learner_id].push(sub);
        }
        // TEST: Grouped submissions by learner
        /*
        console.log("Grouped submissions by learner:", learnerMap);
         */


        const now = new Date();
        const results = [];

        // Loop through learners
        for (const learnerId in learnerMap) {
            // TEST: verify learner loop starts
            /*
            console.log(`\nProcessing learner ${learnerId}`);
             */
            const learnerSubs = learnerMap[learnerId];
            const learnerResults = {};
            let totalScore = 0;
            let totalPoints = 0;

            for (const submission of learnerSubs) {
                const assignment = ag.assignments.find(
                    a => a.id === submission.assignment_id
                );
                // TEST: verify assignment lookup
                /*
                console.log("Assignment found:", assignment?.name);
                if (!assignment) continue;

                 */

                // confirm no divide by zero
                if (assignment.points_possible === 0) {
                    throw new Error(`Assignment ${assignment.id} has 0 possible points`);
                }

                const dueDate = new Date(assignment.due_at);
                // TEST: Verify Due-Dates
                /*
                console.log(
                    `Assignment ${assignment.id} due ${dueDate.toDateString()}, now is ${now.toDateString()}`
                );
                 */
                // This is why learner 1 only has 2 grades in terminal
                // Translation: Do NOT include assignments that are not due yet
                if (dueDate > now) {
                   /* console.log(
                        `Skipping assignment ${assignment.id} — not due yet`
                    );

                    */
                    continue;
                }

                let score = submission.submission.score;

                // type validation
                if (typeof score !== "number") {
                    throw new Error(`Invalid score for learner ${learnerId}`);
                }

                const submittedAt = new Date(submission.submission.submitted_at);
                if (submittedAt > dueDate) {
                    score -= assignment.points_possible * 0.1;
                }
                // TEST: verify late penalty
                /*
                console.log(
                    `Score after late check: ${score} (submitted ${submittedAt.toDateString()})`
                );
                 */


                if (score < 0) score = 0;

                const percentage = Number(
                    // Keeps 3 decimal places rather than long, repeating decimals
                    (score / assignment.points_possible).toFixed(3)
                );

                learnerResults[assignment.id] = percentage;

                totalScore += score;
                totalPoints += assignment.points_possible;
            }
            // To define avg
            /*
            const avg = totalScore/ totalPoints
            // TEST: verify final learner object

            console.log("Final learner result:", {
                id: Number(learnerId),
                avg: Number(avg.toFixed(3)),
                ...learnerResults
            });
             */

            results.push({
                id: Number(learnerId),
                avg: Number((totalScore / totalPoints).toFixed(3)),
                ...learnerResults
            });
        }

        return results;

    } catch (error) {
        console.error("Error:", error.message);
        return [];
    }

}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

console.log(result);

// TEST: Invalid course_id (triggers error handling)
// const badAssignmentGroup = { ...AssignmentGroup, course_id: 999 };

// console.log(
//    getLearnerData(CourseInfo, badAssignmentGroup, LearnerSubmissions)
// );
