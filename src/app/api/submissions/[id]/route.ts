import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TopicSubmission from '@/models/TopicSubmission';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Submission ID is required' },
        { status: 400 }
      );
    }

    const deletedSubmission = await TopicSubmission.findByIdAndDelete(id);

    if (!deletedSubmission) {
      return NextResponse.json(
        { success: false, message: 'Submission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Submission deleted successfully',
        data: {
          id: deletedSubmission._id,
          fullName: deletedSubmission.fullName,
          matricNumber: deletedSubmission.matricNumber,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete submission' },
      { status: 500 }
    );
  }
}
