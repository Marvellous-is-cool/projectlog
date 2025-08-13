import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import TopicSubmission from "@/models/TopicSubmission";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { fullName, matricNumber, discipline, projectTopic } = body;

    // Validate required fields
    if (!fullName || !matricNumber || !discipline || !projectTopic) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Create new submission
    const submission = new TopicSubmission({
      fullName: fullName.trim(),
      matricNumber: matricNumber.trim().toUpperCase(),
      discipline,
      projectTopic: projectTopic.trim(),
    });

    await submission.save();

    return NextResponse.json(
      {
        success: true,
        message: "Topic submitted successfully!",
        data: {
          id: submission._id,
          fullName: submission.fullName,
          matricNumber: submission.matricNumber,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Submission error:", error);

    // Handle duplicate key errors
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      const mongoError = error as unknown as {
        keyPattern: Record<string, number>;
      };
      const field = Object.keys(mongoError.keyPattern)[0];
      const message =
        field === "matricNumber"
          ? "This matric number has already been used"
          : "This entry already exists";

      return NextResponse.json({ success: false, message }, { status: 409 });
    }

    // Handle custom duplicate errors from pre-save middleware
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "DuplicateError"
    ) {
      const customError = error as unknown as { message: string };
      return NextResponse.json(
        { success: false, message: customError.message },
        { status: 409 }
      );
    }

    // Handle validation errors
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "ValidationError"
    ) {
      const validationError = error as unknown as {
        errors: Record<string, { message: string }>;
      };
      const messages = Object.values(validationError.errors).map(
        (err) => err.message
      );
      return NextResponse.json(
        { success: false, message: messages.join(". ") },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while submitting your topic",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();

    const submissions = await TopicSubmission.find({})
      .sort({ createdAt: -1 })
      .lean();

    const formattedSubmissions = submissions.map((submission) => ({
      id: (submission._id as { toString: () => string }).toString(),
      fullName: submission.fullName,
      matricNumber: submission.matricNumber,
      discipline: submission.discipline,
      projectTopic: submission.projectTopic,
      createdAt: submission.createdAt,
      updatedAt: submission.updatedAt,
    }));

    return NextResponse.json(
      {
        success: true,
        data: formattedSubmissions,
        count: formattedSubmissions.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}
