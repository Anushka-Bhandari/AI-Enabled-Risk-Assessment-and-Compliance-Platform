import json

from app.services.llm_client import LLMClient
from app.prompts.document_analysis_prompt import (
    build_document_analysis_prompt,
)


class DocumentAnalysisEngine:
    """
    AI-powered document analysis engine.

    Input:
        - Extracted document text
        - CONTROL_LIBRARY

    Output:
        {
            "C001": {
                "status": "...",
                "confidence": ...,
                "evidence": "..."
            },
            ...
        }
    """

    def __init__(
        self,
        document_text,
        controls,
    ):
        self.document_text = document_text

        self.controls = controls

        self.llm = LLMClient()

    def run(self):

        prompt = build_document_analysis_prompt(
            document_text=self.document_text,
            controls=self.controls,
        )

        response = self.llm.generate(
            system_prompt=prompt["system_prompt"],
            user_prompt=prompt["user_prompt"],
        )

        parsed_response = self._parse_response(
            response
        )

        self._validate_response(
            parsed_response
        )

        return self._format_response(
            parsed_response
        )

    def _parse_response(
        self,
        response,
    ):

        try:
            return json.loads(response)

        except json.JSONDecodeError as error:

            raise ValueError(
                "LLM returned invalid JSON."
            ) from error

    def _validate_response(
        self,
        response,
    ):

        if "controls" not in response:

            raise ValueError(
                "LLM response missing 'controls'."
            )

        for control in response["controls"]:

            required_fields = [
                "control_id",
                "control_name",
                "status",
                "confidence",
                "evidence",
            ]

            for field in required_fields:

                if field not in control:

                    raise ValueError(
                        f"Missing '{field}' in LLM response."
                    )

    def _format_response(
        self,
        response,
    ):

        formatted = {}

        for control in response["controls"]:

            formatted[
                control["control_id"]
            ] = {

                "status": control["status"],

                "confidence": control["confidence"],

                "evidence": control["evidence"],
            }

        return formatted