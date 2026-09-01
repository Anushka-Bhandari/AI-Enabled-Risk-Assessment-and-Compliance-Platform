import json

from app.services.llm_client import LLMClient
from app.prompts.document_analysis_prompt import (
    build_document_analysis_prompt,
)


class DocumentAnalysisEngine:
    """
    AI-powered document analysis engine.

    Large documents are split into chunks so that
    a single LLM request does not become too large.

    Output:
        {
            "C001": {
                "status": "...",
                "confidence": ...,
                "evidence": "..."
            }
        }
    """

    # Keep chunks reasonably small.
    # This is character-based, not token-based.
    CHUNK_SIZE = 6000

    # Small overlap prevents important sentences from being
    # lost when a requirement sits between two chunks.
    CHUNK_OVERLAP = 500

    CONTROL_BATCH_SIZE = 15

    def __init__(
        self,
        document_text,
        controls,
    ):
        self.document_text = document_text or ""

        self.controls = controls

        self.llm = LLMClient()

    # ==========================================================
    # PUBLIC API
    # ==========================================================

    def _create_control_batches(self):

        batches = []

        for i in range(
            0,
            len(self.controls),
            self.CONTROL_BATCH_SIZE
        ):

            batches.append(
                self.controls[
                    i:i + self.CONTROL_BATCH_SIZE
                ]
            )

        return batches

    def run(self):

        if not self.document_text.strip():
            return {}

        chunks = self._create_chunks()

        print("====================================")
        print("DOCUMENT ANALYSIS")
        print("DOCUMENT CHARACTERS:", len(self.document_text))
        print("NUMBER OF CHUNKS:", len(chunks))
        print("====================================")

        all_results = []

        control_batches = (
            self._create_control_batches()
        )

        print(
            "CONTROL BATCHES:",
            len(control_batches)
        )

        for chunk_index, chunk in enumerate(
            chunks,
            start=1
        ):

            for batch_index, batch in enumerate(
                control_batches,
                start=1
            ):

                print(
                    f"Chunk {chunk_index}/{len(chunks)} "
                    f"Batch {batch_index}/{len(control_batches)}"
                )

                result = self._analyze_chunk(
                    chunk,
                    batch
                )

                all_results.append(result)

        merged_results = self._merge_results(
            all_results
        )

        return merged_results

    # ==========================================================
    # CHUNKING
    # ==========================================================

    def _create_chunks(self):

        text = self.document_text.strip()

        if len(text) <= self.CHUNK_SIZE:
            return [text]

        chunks = []

        start = 0
        text_length = len(text)

        while start < text_length:

            end = start + self.CHUNK_SIZE

            chunk = text[start:end]

            chunks.append(chunk)

            # Move forward while keeping overlap.
            start = end - self.CHUNK_OVERLAP

        return chunks

    # ==========================================================
    # ANALYZE ONE CHUNK
    # ==========================================================

    def _analyze_chunk(
        self,
        document_chunk,
        controls,
    ):

        prompt = build_document_analysis_prompt(
            document_text=document_chunk,
            controls=controls,
        )

        response = self.llm.generate(
            system_prompt=prompt["system_prompt"],
            user_prompt=prompt["user_prompt"],
            model="openai/gpt-oss-120b",
        )

        parsed_response = self._parse_response(
            response
        )

        self._validate_response(
            parsed_response
        )

        print(
            "CONTROLS IN REQUEST:",
            len(self.controls)
        )

        return parsed_response

    # ==========================================================
    # PARSE JSON
    # ==========================================================

    def _parse_response(
        self,
        response,
    ):

        try:

            response = response.strip()

            if response.startswith("```json"):

                response = response[
                    len("```json"):
                ]

            elif response.startswith("```"):

                response = response[
                    len("```"):
                ]

            if response.endswith("```"):

                response = response[:-3]

            response = response.strip()

            return json.loads(response)

        except json.JSONDecodeError as error:

            print("====================================")
            print("FAILED DOCUMENT LLM RESPONSE")
            print("====================================")
            print(response)
            print("====================================")

            raise ValueError(
                "LLM returned invalid JSON."
            ) from error

    # ==========================================================
    # VALIDATE
    # ==========================================================

    def _validate_response(
        self,
        response,
    ):

        if not isinstance(response, dict):

            raise ValueError(
                "LLM response must be a JSON object."
            )

        if "controls" not in response:

            raise ValueError(
                "LLM response missing 'controls'."
            )

        if not isinstance(
            response["controls"],
            list
        ):

            raise ValueError(
                "'controls' must be a list."
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
                        f"Missing '{field}' "
                        f"in LLM response."
                    )

    # ==========================================================
    # MERGE CHUNK RESULTS
    # ==========================================================

    def _merge_results(
        self,
        chunk_results,
    ):

        merged = {}

        priority = {
            "IMPLEMENTED": 3,
            "PARTIALLY_IMPLEMENTED": 2,
            "NOT_IMPLEMENTED": 1,
            "NOT_APPLICABLE": 0,
        }

        for result in chunk_results:

            for control in result.get(
                "controls",
                []
            ):

                control_id = control[
                    "control_id"
                ]

                status = control[
                    "status"
                ]

                confidence = control[
                    "confidence"
                ]

                evidence = control[
                    "evidence"
                ]

                if control_id not in merged:

                    merged[control_id] = {
                        "control_id": control_id,
                        "control_name": control[
                            "control_name"
                        ],
                        "status": status,
                        "confidence": confidence,
                        "evidence": evidence,
                    }

                    continue

                existing = merged[
                    control_id
                ]

                # Keep the strongest status found
                if priority.get(
                    status,
                    0
                ) > priority.get(
                    existing["status"],
                    0
                ):

                    existing["status"] = status

                # Keep the highest confidence
                if (
                    confidence is not None
                    and
                    (
                        existing["confidence"]
                        is None
                        or
                        confidence
                        >
                        existing["confidence"]
                    )
                ):

                    existing[
                        "confidence"
                    ] = confidence

                # Combine evidence
                if evidence:

                    existing_evidence = (
                        existing["evidence"]
                    )

                    if evidence not in (
                        existing_evidence
                        or ""
                    ):

                        if existing_evidence:

                            existing[
                                "evidence"
                            ] = (
                                existing_evidence
                                + "\n\n"
                                + evidence
                            )

                        else:

                            existing[
                                "evidence"
                            ] = evidence

        # Convert back to the structure expected
        # by ComplianceEngine.

        formatted = {}

        for control_id, control in merged.items():

            formatted[
                control_id
            ] = {

                "status":
                    control["status"],

                "confidence":
                    control["confidence"],

                "evidence":
                    control["evidence"],
            }

        return formatted