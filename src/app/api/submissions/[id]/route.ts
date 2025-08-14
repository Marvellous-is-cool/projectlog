import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import TopicSubmission from "@/models/TopicSubmission";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;
    const body = await request.json();
    const { fullName, matricNumber, discipline, projectTopic } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Submission ID is required" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!fullName || !matricNumber || !discipline || !projectTopic) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Update existing submission
    const updatedSubmission = await TopicSubmission.findByIdAndUpdate(
      id,
      {
        fullName: fullName.trim(),
        matricNumber: matricNumber.trim().toUpperCase(),
        discipline,
        projectTopic: projectTopic.trim(),
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedSubmission) {
      return NextResponse.json(
        { success: false, message: "Submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Submission updated successfully!",
        data: {
          id: updatedSubmission._id,
          fullName: updatedSubmission.fullName,
          matricNumber: updatedSubmission.matricNumber,
          discipline: updatedSubmission.discipline,
          projectTopic: updatedSubmission.projectTopic,
          submissionDate: updatedSubmission.submissionDate,
          updatedAt: updatedSubmission.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Update error:", error);

    // Handle duplicate key errors
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "A submission with this matric number already exists",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to update submission" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Submission ID is required" },
        { status: 400 }
      );
    }

    const deletedSubmission = await TopicSubmission.findByIdAndDelete(id);

    if (!deletedSubmission) {
      return NextResponse.json(
        { success: false, message: "Submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Submission deleted successfully",
        data: {
          id: deletedSubmission._id,
          fullName: deletedSubmission.fullName,
          matricNumber: deletedSubmission.matricNumber,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete submission" },
      { status: 500 }
    );
  }
}
