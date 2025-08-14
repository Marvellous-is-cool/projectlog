import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import TopicSubmission from "@/models/TopicSubmission";
import { stringify } from "csv-stringify/sync";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  AlignmentType,
  TextRun,
} from "docx";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "csv";
    const discipline = searchParams.get("discipline"); // 'linguistics', 'communication', or null for all

    // Build query based on discipline filter
    const query = discipline ? { discipline } : {};

    const submissions = await TopicSubmission.find(query)
      .sort({ createdAt: -1 })
      .lean();

    if (submissions.length === 0) {
      return NextResponse.json(
        { success: false, message: "No submissions found" },
        { status: 404 }
      );
    }

    const disciplineLabel = discipline
      ? discipline.charAt(0).toUpperCase() + discipline.slice(1)
      : "All Disciplines";

    const data = submissions.map((submission, index) => ({
      "S/N": index + 1,
      "Full Name": submission.fullName,
      "Matric Number": submission.matricNumber,
      Discipline:
        submission.discipline.charAt(0).toUpperCase() +
        submission.discipline.slice(1),
      "Project Topic": submission.projectTopic,
      "Date Submitted": new Date(submission.createdAt).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      ),
    }));

    if (format === "csv") {
      const csvData = stringify(data, {
        header: true,
        columns: [
          "S/N",
          "Full Name",
          "Matric Number",
          "Discipline",
          "Project Topic",
          "Date Submitted",
        ],
      });

      const fileName = discipline
        ? `${discipline}-submissions-${
            new Date().toISOString().split("T")[0]
          }.csv`
        : `topic-submissions-${new Date().toISOString().split("T")[0]}.csv`;

      return new NextResponse(csvData, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${fileName}"`,
        },
      });
    }

    if (format === "docx") {
      // Create DOCX document
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Topic Submissions Report - ${disciplineLabel}`,
                    bold: true,
                    size: 32,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Generated on: ${new Date().toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}`,
                    size: 20,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({ text: "" }), // Empty line
              new Table({
                columnWidths: [1000, 2000, 1500, 2000, 3000, 1500],
                rows: [
                  // Header row
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({ text: "S/N", bold: true }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({ text: "Full Name", bold: true }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: "Matric Number",
                                bold: true,
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({ text: "Discipline", bold: true }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: "Project Topic",
                                bold: true,
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: "Date Submitted",
                                bold: true,
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  // Data rows
                  ...data.map(
                    (item, index) =>
                      new TableRow({
                        children: [
                          new TableCell({
                            children: [
                              new Paragraph({
                                children: [
                                  new TextRun({ text: String(index + 1) }),
                                ],
                              }),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph({
                                children: [
                                  new TextRun({ text: item["Full Name"] }),
                                ],
                              }),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph({
                                children: [
                                  new TextRun({ text: item["Matric Number"] }),
                                ],
                              }),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph({
                                children: [
                                  new TextRun({ text: item.Discipline }),
                                ],
                              }),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph({
                                children: [
                                  new TextRun({ text: item["Project Topic"] }),
                                ],
                              }),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph({
                                children: [
                                  new TextRun({ text: item["Date Submitted"] }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      })
                  ),
                ],
              }),
            ],
          },
        ],
      });

      const buffer = await Packer.toBuffer(doc);
      const fileName = discipline
        ? `${discipline}-submissions-${
            new Date().toISOString().split("T")[0]
          }.docx`
        : `topic-submissions-${new Date().toISOString().split("T")[0]}.docx`;

      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename="${fileName}"`,
        },
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "Unsupported export format. Use csv or docx.",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to export submissions" },
      { status: 500 }
    );
  }
}
