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
    try {
        // ✅ validation FIRST
        if (ag.course_id !== course.id) {
            throw new Error("AssignmentGroup does not belong to this course");
        }

        const learnerMap = {};

        // Step 1: Group submissions by learner
        for (const sub of submissions) {
            if (!learnerMap[sub.learner_id]) {
                learnerMap[sub.learner_id] = [];
            }
            learnerMap[sub.learner_id].push(sub);
        }

        const now = new Date();
        const results = [];

        // Step 2: Loop through learners
        for (const learnerId in learnerMap) {
            const learnerSubs = learnerMap[learnerId];
            const learnerResults = {};
            let totalScore = 0;
            let totalPoints = 0;

            for (const submission of learnerSubs) {
                const assignment = ag.assignments.find(
                    a => a.id === submission.assignment_id
                );
                if (!assignment) continue;

                // ✅ protect against divide by zero
                if (assignment.points_possible === 0) {
                    throw new Error(`Assignment ${assignment.id} has 0 possible points`);
                }

                const dueDate = new Date(assignment.due_at);
                if (dueDate > now) continue;

                let score = submission.submission.score;

                // ✅ basic type validation
                if (typeof score !== "number") {
                    throw new Error(`Invalid score for learner ${learnerId}`);
                }

                const submittedAt = new Date(submission.submission.submitted_at);
                if (submittedAt > dueDate) {
                    score -= assignment.points_possible * 0.1;
                }

                if (score < 0) score = 0;

                const percentage = Number(
                    (score / assignment.points_possible).toFixed(3)
                );

                learnerResults[assignment.id] = percentage;

                totalScore += score;
                totalPoints += assignment.points_possible;
            }

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

// TEST: Invalid course_id (should trigger error handling)
// const badAssignmentGroup = { ...AssignmentGroup, course_id: 999 };

// console.log(
//    getLearnerData(CourseInfo, badAssignmentGroup, LearnerSubmissions)
// );
