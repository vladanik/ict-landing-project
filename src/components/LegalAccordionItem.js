import React from 'react';
import {Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button} from "@mui/material";
import {ExpandMore} from "@mui/icons-material";
import {formatText} from "../utils/Utils";
import {LEGAL_HEADER_DIVIDER} from "../utils/Constant";
import {Document, AlignmentType, Packer, Paragraph, TextRun} from "docx";

function LegalAccordionItem({ section, index }) {
    const legalData = section.split(LEGAL_HEADER_DIVIDER);

    const download = () => {
        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: [
                        new Paragraph({
                            text: "ICT Władysław Danik",
                            heading: "Title",
                            alignment: AlignmentType.CENTER,
                            bold: true,
                        }),
                        new Paragraph({
                            text: legalData[0],
                            heading: "Heading1",
                            alignment: AlignmentType.CENTER,
                            bold: true,
                            spacing: { after: 200 },
                        }),
                        ...legalData[1].split("\\\\").map((line) =>
                            new Paragraph({
                                children: line.split(/(\*\*.*?\*\*)/).map((part) => {
                                    if (part.match(/\*\*(.*?)\*\*/)) {
                                        return new TextRun({
                                            text: part.replace(/\*\*/g, ""),
                                            bold: true,
                                        });
                                    }
                                    return new TextRun(part);
                                }),
                                spacing: { after: 100 },
                            })
                        )
                    ],
                },
            ],
        });

        Packer.toBlob(doc).then((blob) => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `ICT_LegalNotice_${index + 1}.docx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={'panel' + index + '-content'}
                id={'panel' + index + '-header'}
            >
                {legalData[0]}
            </AccordionSummary>
            <AccordionActions>
                <Button onClick={download}>Download</Button>
            </AccordionActions>
            <AccordionDetails>
                <p dangerouslySetInnerHTML={formatText(legalData[1])}></p>
            </AccordionDetails>
        </Accordion>
    );
}

export default LegalAccordionItem;