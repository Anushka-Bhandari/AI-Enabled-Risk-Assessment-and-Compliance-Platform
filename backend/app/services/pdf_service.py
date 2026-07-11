import os
from datetime import datetime
from html import escape
from typing import Any, Dict, Iterable, List, Optional, Sequence

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

from app.services.recommendation_engine import RecommendationEngine
from app.services.report_service import ReportService


class PDFService:
    """Render a completed assessment as a professional ReportLab PDF."""

    def __init__(self, assessment_id: int):

        self.assessment_id = assessment_id
        self.report_data: Optional[Dict[str, Any]] = None
        self.recommendations: Optional[Dict[str, Any]] = None
        self.generated_at: Optional[datetime] = None

        self.styles = getSampleStyleSheet()
        self._configure_styles()

        self.output_folder = os.path.join(
            os.path.dirname(__file__),
            "..",
            "reports",
            "generated",
        )
        os.makedirs(self.output_folder, exist_ok=True)

    # ====================================================
    # Styles and rendering helpers
    # ====================================================

    def _configure_styles(self) -> None:

        self.brand_color = colors.HexColor("#0B3D91")
        self.brand_light = colors.HexColor("#EAF1FB")
        self.border_color = colors.HexColor("#B7C7DE")

        self.title_style = ParagraphStyle(
            "ReportTitle",
            parent=self.styles["Heading1"],
            alignment=TA_CENTER,
            fontName="Helvetica-Bold",
            fontSize=21,
            leading=26,
            textColor=self.brand_color,
            spaceAfter=14,
        )
        self.heading_style = ParagraphStyle(
            "ReportSectionHeading",
            parent=self.styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=15,
            leading=19,
            textColor=self.brand_color,
            spaceBefore=14,
            spaceAfter=7,
            keepWithNext=True,
        )
        self.subheading_style = ParagraphStyle(
            "ReportSubheading",
            parent=self.styles["Heading3"],
            fontName="Helvetica-Bold",
            fontSize=10.5,
            leading=14,
            textColor=self.brand_color,
            spaceBefore=8,
            spaceAfter=3,
            keepWithNext=True,
        )
        self.normal_style = ParagraphStyle(
            "ReportBody",
            parent=self.styles["BodyText"],
            fontName="Helvetica",
            fontSize=9.2,
            leading=13,
            spaceAfter=4,
        )
        self.bullet_style = ParagraphStyle(
            "ReportBullet",
            parent=self.normal_style,
            leftIndent=11,
            firstLineIndent=-7,
            spaceAfter=2,
        )
        self.table_header_style = ParagraphStyle(
            "ReportTableHeader",
            parent=self.normal_style,
            fontName="Helvetica-Bold",
            fontSize=8.7,
            leading=11,
            textColor=colors.white,
        )
        self.table_cell_style = ParagraphStyle(
            "ReportTableCell",
            parent=self.normal_style,
            fontSize=8.5,
            leading=11,
            spaceAfter=0,
        )
        self.table_label_style = ParagraphStyle(
            "ReportTableLabel",
            parent=self.table_cell_style,
            fontName="Helvetica-Bold",
            textColor=self.brand_color,
        )
        self.card_title_style = ParagraphStyle(
            "RecommendationCardTitle",
            parent=self.subheading_style,
            fontSize=11.5,
            leading=15,
            spaceBefore=11,
            spaceAfter=5,
        )

    def _load_data(self) -> None:

        self.report_data = ReportService(
            self.assessment_id
        ).build_report_data()
        self.recommendations = RecommendationEngine(
            self.assessment_id
        ).run()

    def _filename(self) -> str:

        timestamp = (self.generated_at or datetime.now()).strftime(
            "%Y%m%d_%H%M%S"
        )
        return os.path.join(
            self.output_folder,
            f"assessment_{self.assessment_id}_{timestamp}.pdf",
        )

    @staticmethod
    def _as_list(value: Any) -> List[Any]:

        if value is None:
            return []
        if isinstance(value, (list, tuple)):
            return list(value)
        return [value]

    @staticmethod
    def _display_value(value: Any, default: str = "Not available") -> str:

        if value is None or value == "":
            return default
        return str(value)

    def _safe_text(self, value: Any) -> str:

        return escape(self._display_value(value)).replace("\n", "<br/>")

    def _paragraph(self, value: Any, style: Optional[ParagraphStyle] = None) -> Paragraph:

        return Paragraph(self._safe_text(value), style or self.normal_style)

    def _labeled_paragraph(self, label: str, value: Any) -> Paragraph:

        return Paragraph(
            f"<b>{escape(label)}:</b> {self._safe_text(value)}",
            self.normal_style,
        )

    def _add_section_heading(self, story: List[Any], title: str) -> None:

        story.append(Paragraph(escape(title), self.heading_style))

    def _add_bullets(self, story: List[Any], items: Iterable[Any]) -> None:

        values = self._as_list(items)
        if not values:
            story.append(self._paragraph("No items are available."))
            return

        for item in values:
            story.append(
                Paragraph(f"- {self._safe_text(item)}", self.bullet_style)
            )

    def _table_cell(self, value: Any, style: ParagraphStyle) -> Paragraph:

        return Paragraph(self._safe_text(value), style)

    def _build_table(
        self,
        headers: Sequence[str],
        rows: Sequence[Sequence[Any]],
        column_widths: Sequence[float],
    ) -> Table:

        table_rows: List[List[Paragraph]] = [
            [
                self._table_cell(header, self.table_header_style)
                for header in headers
            ]
        ]

        if rows:
            table_rows.extend(
                [
                    [
                        self._table_cell(value, self.table_cell_style)
                        for value in row
                    ]
                    for row in rows
                ]
            )
        else:
            table_rows.append(
                [
                    self._table_cell(
                        "No results are available.",
                        self.table_cell_style,
                    )
                ]
                + [
                    self._table_cell("", self.table_cell_style)
                    for _ in headers[1:]
                ]
            )

        table = Table(
            table_rows,
            colWidths=column_widths,
            repeatRows=1,
            hAlign="LEFT",
        )
        table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), self.brand_color),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                    ("GRID", (0, 0), (-1, -1), 0.4, self.border_color),
                    ("BACKGROUND", (0, 1), (-1, -1), colors.white),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 6),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                    ("TOPPADDING", (0, 0), (-1, -1), 5),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ]
            )
        )
        return table

    def _build_information_table(
        self,
        rows: Sequence[Sequence[Any]],
        label_width: float = 2.0 * inch,
    ) -> Table:

        table_rows = [
            [
                self._table_cell(label, self.table_label_style),
                self._table_cell(value, self.table_cell_style),
            ]
            for label, value in rows
        ]
        table = Table(
            table_rows,
            colWidths=[label_width, 4.15 * inch],
            hAlign="LEFT",
        )
        table.setStyle(
            TableStyle(
                [
                    ("GRID", (0, 0), (-1, -1), 0.4, self.border_color),
                    ("BACKGROUND", (0, 0), (0, -1), self.brand_light),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 6),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                    ("TOPPADDING", (0, 0), (-1, -1), 5),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ]
            )
        )
        return table

    def _score(self, value: Any) -> str:

        try:
            return f"{float(value):.2f}"
        except (TypeError, ValueError):
            return self._display_value(value)

    # ====================================================
    # Report sections
    # ====================================================

    def _build_cover_page(self, story: List[Any]) -> None:

        assessment = self.report_data["assessment"]
        university = self.report_data["university"]

        story.append(Spacer(1, 1.1 * inch))
        story.append(
            Paragraph(
                "AI-Enabled Cybersecurity Risk Assessment &amp; Compliance Platform",
                self.title_style,
            )
        )
        story.append(
            Paragraph(
                "Assessment Report",
                ParagraphStyle(
                    "CoverSubtitle",
                    parent=self.subheading_style,
                    alignment=TA_CENTER,
                    fontSize=13,
                    leading=17,
                    spaceAfter=18,
                ),
            )
        )
        story.append(
            self._build_information_table(
                [
                    ("Assessment ID", assessment.get("assessment_id")),
                    ("University", university.get("name")),
                    ("Assessment Mode", assessment.get("assessment_mode")),
                    (
                        "Generated Time",
                        (self.generated_at or datetime.now()).strftime(
                            "%d-%m-%Y %H:%M"
                        ),
                    ),
                ],
                label_width=1.75 * inch,
            )
        )
        story.append(PageBreak())

    def _build_summary_page(self, story: List[Any]) -> None:

        assessment = self.report_data["assessment"]
        recommendations = self.recommendations or {}

        self._add_section_heading(story, "Executive Summary")
        story.append(
            self._paragraph(
                recommendations.get(
                    "executive_summary",
                    "No executive summary was generated.",
                )
            )
        )
        story.append(
            self._build_information_table(
                [
                    (
                        "Compliance Score",
                        f"{self._score(assessment.get('compliance_score'))} %",
                    ),
                    (
                        "Overall Risk Score",
                        self._score(assessment.get("overall_risk_score")),
                    ),
                    ("Risk Level", assessment.get("risk_level")),
                    (
                        "Overall Priority",
                        recommendations.get("overall_priority"),
                    ),
                ]
            )
        )
        story.append(Paragraph("Immediate Actions", self.subheading_style))
        self._add_bullets(story, recommendations.get("immediate_actions"))

    def _build_assessment_source_page(self, story: List[Any]) -> None:

        source = self.report_data.get("source", {})
        mode = source.get(
            "assessment_mode",
            self.report_data["assessment"].get("assessment_mode"),
        )
        questionnaire = source.get("questionnaire", {})
        documents = source.get("documents", {})

        self._add_section_heading(story, "Assessment Source")

        if mode == "QUESTIONNAIRE":
            story.append(
                self._build_information_table(
                    [
                        ("Assessment Source", "Questionnaire"),
                        (
                            "Answered Controls",
                            questionnaire.get("answered_controls"),
                        ),
                        ("Total Controls", questionnaire.get("total_controls")),
                        (
                            "Unanswered Controls",
                            questionnaire.get("unanswered_controls"),
                        ),
                    ]
                )
            )
            story.append(self._paragraph(questionnaire.get("summary")))
            return

        if mode == "DOCUMENT":
            story.append(
                self._build_information_table(
                    [
                        ("Assessment Source", "Document Analysis"),
                        (
                            "Uploaded Document Count",
                            documents.get("uploaded_document_count"),
                        ),
                    ]
                )
            )
            story.append(Paragraph("Uploaded Documents", self.subheading_style))
            self._add_bullets(story, documents.get("original_filenames"))
            story.append(self._paragraph(documents.get("evidence_note")))
            return

        story.append(
            self._build_information_table(
                [
                    ("Assessment Source", source.get("source_type")),
                    (
                        "Answered Controls",
                        questionnaire.get("answered_controls"),
                    ),
                    (
                        "Uploaded Document Count",
                        documents.get("uploaded_document_count"),
                    ),
                ]
            )
        )
        story.append(Paragraph("Questionnaire Summary", self.subheading_style))
        story.append(self._paragraph(questionnaire.get("summary")))
        story.append(Paragraph("Uploaded Documents", self.subheading_style))
        self._add_bullets(story, documents.get("original_filenames"))
        story.append(self._paragraph(documents.get("evidence_note")))

    def _build_compliance_page(self, story: List[Any]) -> None:

        self._add_section_heading(story, "Compliance Summary")
        rows = [
            [item.get("control_id"), item.get("status")]
            for item in sorted(
                self.report_data.get("compliance_results", []),
                key=lambda item: str(item.get("control_id", "")),
            )
        ]
        story.append(
            self._build_table(
                ["Control ID", "Compliance Status"],
                rows,
                [1.65 * inch, 4.5 * inch],
            )
        )

    def _build_category_risk_page(self, story: List[Any]) -> None:

        self._add_section_heading(story, "Category Risk Summary")
        rows = [
            [
                item.get("category"),
                self._score(item.get("risk_score")),
                item.get("risk_level"),
            ]
            for item in sorted(
                self.report_data.get("category_risks", []),
                key=lambda item: str(item.get("category", "")),
            )
        ]
        story.append(
            self._build_table(
                ["Category", "Risk Score", "Risk Level"],
                rows,
                [3.2 * inch, 1.35 * inch, 1.6 * inch],
            )
        )

    def _build_control_risk_page(self, story: List[Any]) -> None:

        self._add_section_heading(story, "Control Risk Summary")
        rows = [
            [
                item.get("control_id"),
                self._score(item.get("risk_score")),
                item.get("risk_level"),
            ]
            for item in sorted(
                self.report_data.get("control_risks", []),
                key=lambda item: str(item.get("control_id", "")),
            )
        ]
        story.append(
            self._build_table(
                ["Control ID", "Risk Score", "Risk Level"],
                rows,
                [1.65 * inch, 2.15 * inch, 2.35 * inch],
            )
        )

    def _build_recommendation_pages(self, story: List[Any]) -> None:

        recommendations = self._as_list(
            (self.recommendations or {}).get("recommendations")
        )

        if not recommendations:
            self._add_section_heading(story, "AI Recommendations")
            story.append(self._paragraph("No recommendations were generated."))
            return

        for index, recommendation in enumerate(recommendations):
            if not isinstance(recommendation, dict):
                continue

            control_title = (
                f"{self._display_value(recommendation.get('control_id'))} - "
                f"{self._display_value(recommendation.get('control_name'))}"
            )
            card_intro = [
                Paragraph(self._safe_text(control_title), self.card_title_style),
                self._build_table(
                    [
                        "Priority",
                        "Timeline",
                        "Estimated Effort",
                        "Implementation Cost",
                    ],
                    [
                        [
                            recommendation.get("priority"),
                            recommendation.get("implementation_timeline"),
                            recommendation.get("estimated_effort"),
                            recommendation.get("implementation_cost"),
                        ]
                    ],
                    [1.3 * inch, 1.65 * inch, 1.65 * inch, 1.7 * inch],
                ),
                self._labeled_paragraph(
                    "Root Cause",
                    recommendation.get("root_cause"),
                ),
                self._labeled_paragraph(
                    "Recommendation",
                    recommendation.get("recommendation"),
                ),
            ]
            if index == 0:
                card_intro.insert(
                    0,
                    Paragraph("AI Recommendations", self.heading_style),
                )
            story.append(KeepTogether(card_intro))
            story.append(Paragraph("Technical Steps", self.subheading_style))
            self._add_bullets(story, recommendation.get("technical_steps"))
            story.append(Paragraph("Policy Steps", self.subheading_style))
            self._add_bullets(story, recommendation.get("policy_steps"))
            story.append(
                self._labeled_paragraph(
                    "Business Impact",
                    recommendation.get("business_impact"),
                )
            )
            story.append(Paragraph("Success Metrics", self.subheading_style))
            self._add_bullets(story, recommendation.get("success_metrics"))
            story.append(Spacer(1, 0.12 * inch))

    @staticmethod
    def _roadmap_bucket(timeline: Any) -> str:

        value = str(timeline or "").lower()
        if "90" in value:
            return "90 Days"
        if "60" in value:
            return "60 Days"
        if "30" in value:
            return "30 Days"
        return "Immediate"

    def _build_implementation_roadmap(self, story: List[Any]) -> None:

        recommendations = self._as_list(
            (self.recommendations or {}).get("recommendations")
        )
        roadmap = {
            "Immediate": self._as_list(
                (self.recommendations or {}).get("immediate_actions")
            ),
            "30 Days": [],
            "60 Days": [],
            "90 Days": [],
        }

        for recommendation in recommendations:
            if not isinstance(recommendation, dict):
                continue
            bucket = self._roadmap_bucket(
                recommendation.get("implementation_timeline")
            )
            roadmap[bucket].append(
                (
                    f"{self._display_value(recommendation.get('control_id'))} - "
                    f"{self._display_value(recommendation.get('control_name'))}"
                )
            )

        self._add_section_heading(story, "Implementation Roadmap")
        rows = []
        for timeframe in ("Immediate", "30 Days", "60 Days", "90 Days"):
            actions = roadmap[timeframe]
            action_text = "\n".join(
                f"- {self._display_value(action)}"
                for action in actions
            ) or "No activities scheduled."
            rows.append([timeframe, action_text])

        story.append(
            self._build_table(
                ["Timeframe", "Planned Activity"],
                rows,
                [1.35 * inch, 4.8 * inch],
            )
        )

    # ====================================================
    # Header and footer
    # ====================================================

    def _add_page_number(self, canvas: Any, doc: Any) -> None:

        canvas.saveState()
        page_width, page_height = canvas._pagesize

        canvas.setStrokeColor(self.border_color)
        canvas.setLineWidth(0.4)
        canvas.line(40, page_height - 32, page_width - 40, page_height - 32)
        canvas.setFont("Helvetica-Bold", 8.5)
        canvas.setFillColor(self.brand_color)
        canvas.drawString(
            40,
            page_height - 25,
            "AI-Enabled Cybersecurity Risk Assessment & Compliance Platform",
        )

        canvas.setFont("Helvetica", 8)
        canvas.setFillColor(colors.black)
        generated_time = (self.generated_at or datetime.now()).strftime(
            "%d-%m-%Y %H:%M"
        )
        canvas.drawString(40, 22, f"Generated: {generated_time}")
        canvas.drawRightString(
            page_width - 40,
            22,
            f"Page {canvas.getPageNumber()}",
        )
        canvas.restoreState()

    # ====================================================
    # Public API
    # ====================================================

    def generate(self) -> Dict[str, Any]:
        """Generate the complete assessment report without changing its API."""

        self.generated_at = datetime.now()
        self._load_data()

        filename = self._filename()
        document = SimpleDocTemplate(
            filename,
            rightMargin=40,
            leftMargin=40,
            topMargin=48,
            bottomMargin=40,
        )
        story: List[Any] = []

        self._build_cover_page(story)
        self._build_summary_page(story)
        self._build_assessment_source_page(story)
        self._build_compliance_page(story)
        self._build_category_risk_page(story)
        self._build_control_risk_page(story)
        self._build_recommendation_pages(story)
        self._build_implementation_roadmap(story)

        document.build(
            story,
            onFirstPage=self._add_page_number,
            onLaterPages=self._add_page_number,
        )

        return {
            "success": True,
            "assessment_id": self.assessment_id,
            "file_name": os.path.basename(filename),
            "file_path": filename,
            "generated_at": self.generated_at.strftime("%d-%m-%Y %H:%M:%S"),
        }

    def build_html(self) -> Dict[str, str]:
        """Temporary helper retained for compatibility."""

        return {
            "message": "ReportLab implementation does not use HTML rendering."
        }
