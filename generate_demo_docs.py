import os

def create_pdf(filename, title, subtitle, metadata, sections, total_line, footer):
    """
    Generate a 100% compliant, standard PDF 1.4 document in pure Python.
    """
    stream_lines = []
    
    # Title
    stream_lines.append("BT")
    stream_lines.append("/F1 15 Tf")
    stream_lines.append("50 740 Td")
    stream_lines.append(f"({title}) Tj")
    
    # Subtitle
    stream_lines.append("/F1 9 Tf")
    stream_lines.append("0 -16 Td")
    stream_lines.append(f"({subtitle}) Tj")
    
    # Divider
    stream_lines.append("0 -12 Td")
    stream_lines.append("(-------------------------------------------------------------------------------------------------------) Tj")
    
    # Metadata
    stream_lines.append("/F1 9.5 Tf")
    y_offset = -14
    for meta in metadata:
        stream_lines.append(f"0 {y_offset} Td")
        stream_lines.append(f"({meta}) Tj")
        y_offset = -13
        
    stream_lines.append("0 -10 Td")
    stream_lines.append("(-------------------------------------------------------------------------------------------------------) Tj")
    
    # Sections & Line items
    for sec_title, items in sections:
        stream_lines.append("/F1 10.5 Tf")
        stream_lines.append("0 -18 Td")
        stream_lines.append(f"({sec_title}) Tj")
        stream_lines.append("/F1 9 Tf")
        for item in items:
            stream_lines.append("0 -13 Td")
            # Escape parenthesis
            safe_item = item.replace("(", "[").replace(")", "]")
            stream_lines.append(f"({safe_item}) Tj")
            
    # Total
    if total_line:
        stream_lines.append("0 -12 Td")
        stream_lines.append("(-------------------------------------------------------------------------------------------------------) Tj")
        stream_lines.append("/F1 11 Tf")
        stream_lines.append("0 -16 Td")
        stream_lines.append(f"({total_line}) Tj")
        
    # Footer
    if footer:
        stream_lines.append("/F1 8.5 Tf")
        stream_lines.append("0 -24 Td")
        safe_footer = footer.replace("(", "[").replace(")", "]")
        stream_lines.append(f"({safe_footer}) Tj")
        
    stream_lines.append("ET")
    
    content_stream = "\n".join(stream_lines)
    content_bytes = content_stream.encode("latin-1")
    length = len(content_bytes)
    
    objects = []
    # 1: Catalog
    objects.append(b"<< /Type /Catalog /Pages 2 0 R >>")
    # 2: Pages
    objects.append(b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>")
    # 3: Page
    objects.append(b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>")
    # 4: Contents
    objects.append(f"<< /Length {length} >>\nstream\n{content_stream}\nendstream".encode("latin-1"))
    # 5: Font
    objects.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")
    
    # Build PDF binary
    pdf = bytearray()
    pdf.extend(b"%PDF-1.4\n")
    
    xref_offsets = [0]
    for i, obj in enumerate(objects):
        xref_offsets.append(len(pdf))
        pdf.extend(f"{i+1} 0 obj\n".encode("latin-1"))
        pdf.extend(obj)
        pdf.extend(b"\nendobj\n")
        
    startxref = len(pdf)
    pdf.extend(f"xref\n0 {len(objects)+1}\n".encode("latin-1"))
    pdf.extend(b"0000000000 65535 f \n")
    for offset in xref_offsets[1:]:
        pdf.extend(f"{offset:010d} 00000 n \n".encode("latin-1"))
        
    pdf.extend(f"trailer\n<< /Size {len(objects)+1} /Root 1 0 R >>\nstartxref\n{startxref}\n%%EOF\n".encode("latin-1"))
    
    with open(filename, "wb") as f:
        f.write(pdf)
    print(f"Created PDF: {os.path.basename(filename)}")


def generate_all_pdfs():
    docs_dir = os.path.join(os.getcwd(), "sample_documents")
    os.makedirs(docs_dir, exist_ok=True)
    
    # Clean out any old non-pdf test files
    for f in os.listdir(docs_dir):
        if not f.endswith(".pdf"):
            try:
                os.remove(os.path.join(docs_dir, f))
            except Exception:
                pass
                
    # 1. Plumbing Invoice PDF ($8,450.00)
    create_pdf(
        os.path.join(docs_dir, "Plumber_Repair_Invoice_POL994821.pdf"),
        title="APEX EMERGENCY PLUMBING & RESTORATION SERVICES",
        subtitle="State License #PLMB-994812-FL | 1042 Industrial Pkwy, Tampa, FL",
        metadata=[
            "Invoice Number: INV-2026-88412        Date: August 26, 2026",
            "Policyholder:   Jane Doe               Policy Number: POL-994821",
            "Loss Address:   742 Evergreen Terrace  Peril: Sudden Kitchen Water Line Rupture"
        ],
        sections=[
            ("ITEMIZED SCOPE OF WORK & CHARGES:", [
                "1. Emergency Water Extraction & Anti-Microbial Prep (280 SF @ $4.50/SF) .......... $1,260.00",
                "2. R&R 3/4in Solid White Oak Hardwood Flooring (240 SF @ $18.50/SF) ............... $4,440.00",
                "3. Base Cabinet Detach & Reset with Custom Millwork (14 LF @ $95.00/LF) ......... $1,330.00",
                "4. Commercial Low-Grain Dehumidifier Rental (72 Hours, 2 Units) ................... $620.00",
                "5. Copper Water Supply Line Solder & Main Shutoff Valve Replacement .............. $800.00"
            ]),
            ("STANDARDS & COMPLIANCE:", [
                "- Drying procedures executed in accordance with IICRC S500 Standard for Water Restoration.",
                "- Moisture readings verified below 12% wood moisture equivalent [WME] threshold."
            ])
        ],
        total_line="TOTAL ITEMIZED INVOICE AMOUNT (RCV): $8,450.00",
        footer="Certified Master Plumber Signature: Mark Sterling | Lic #PLMB-994812-FL"
    )

    # 2. Commercial Fire Loss Report PDF ($142,000.00)
    create_pdf(
        os.path.join(docs_dir, "Warehouse_Fire_Damage_Appraisal.pdf"),
        title="NATIONAL FORENSIC ENGINEERING & FIRE INVESTIGATION",
        subtitle="Commercial Property Loss Division | Incident ID: FIR-2026-33019",
        metadata=[
            "Insured Entity: Apex Commercial Logistics Inc.   Policy Number: POL-330192",
            "Risk Location:  4400 Gateway Logistics Park     Date of Loss:  August 26, 2026",
            "Peril Category: Commercial Fire & Structural Loss  Building Type: Type II Steel Frame"
        ],
        sections=[
            ("STRUCTURAL DAMAGE & SCOPE OF RESTORATION:", [
                "1. Emergency Board-Up & Structural Steel Shoring (Lump Sum) ....................... $4,850.00",
                "2. Charred Wallboard Demolition & EPA Debris Disposal (3,200 SF @ $6.75/SF) ....... $21,600.00",
                "3. W12x26 Structural Steel Beam Fabrication & Replacement (14 Beams) .............. $39,900.00",
                "4. Heavy Industrial 480V Main Panel & Rewiring (180 Hours @ $115.00/hr) ........... $20,700.00",
                "5. Commercial Inventory & Machinery Loss (ACV verified basis) .................... $42,500.00",
                "6. Industrial HEPA Air Scrubbers & Thermal Soot Remediation (6 Units, 72h) ........ $12,450.00"
            ]),
            ("ORIGIN & CAUSE INVESTIGATION NOTE:", [
                "- Origin determined at primary electrical distribution rack. Forensic review pending.",
                "- Subject to Special Investigation Unit [SIU] recorded examinations."
            ])
        ],
        total_line="TOTAL ESTIMATED COMMERCIAL LOSS (RCV): $142,000.00",
        footer="Lead Forensic Structural Engineer: David Vance, PE #FL-49021"
    )

    # 3. Hurricane Roof Damage Report PDF ($38,750.00)
    create_pdf(
        os.path.join(docs_dir, "Hurricane_Roof_Structural_Report.pdf"),
        title="COASTAL STRUCTURAL ENGINEERING CONSULTANTS",
        subtitle="Specialists in Windstorm, Hail, & Structural Envelope Analysis",
        metadata=[
            "Claimant:     Coastal Heritage Realty Group   Policy Number: POL-771820",
            "Property:     120 Ocean View Blvd, Tampa, FL  Date of Loss:  August 26, 2026",
            "Peril Type:   Windstorm & Gale Wind Uplift    Weather Correlation: NOAA Confirmed 78mph"
        ],
        sections=[
            ("ENGINEERING DAMAGE ASSESSMENT & ESTIMATE:", [
                "1. Tear-Off & Disposal of Blown Architectural Shingles (38 SQ @ $330.00/SQ) ....... $12,540.00",
                "2. 5/8in CDX Plywood Roof Decking Replacement (18 Sheets @ $110.00/sheet) ......... $1,980.00",
                "3. Owens Corning Duration Lifetime Shingle System & Underlayment .................. $15,200.00",
                "4. Interior Second-Floor Ceiling Water Stain Drywall & Paint Remediation ......... $6,530.00",
                "5. Florida Building Code Section 1507 Hurricane Tie-Down Strapping Retrofit ....... $2,500.00"
            ]),
            ("CODE COMPLIANCE & WARRANTY:", [
                "- High-wind 130 mph warranty rated shingles required per regional wind zone ordinance."
            ])
        ],
        total_line="TOTAL REPAIR & CODE UPGRADE ESTIMATE (RCV): $38,750.00",
        footer="Senior Property Consultant: Robert Henderson, PE #58821"
    )

    # 4. Auto Hail Damage Estimate PDF ($3,200.00)
    create_pdf(
        os.path.join(docs_dir, "Auto_Hail_Damage_Estimate.pdf"),
        title="PRECISION AUTO COLLISION & GLASS APPRAISALS",
        subtitle="Certified I-CAR Gold Class Property & Casualty Facility",
        metadata=[
            "Vehicle Owner:  Mark Vance                      Policy Number: POL-551029",
            "Vehicle:        2024 Ford F-150 SuperCrew       VIN: 1FTFW1ED8NFA99182",
            "Date of Loss:   August 26, 2026                 Peril: Severe Hail & Windshield Fracture"
        ],
        sections=[
            ("APPRAISAL DAMAGE BREAKDOWN:", [
                "1. Hood Paintless Dent Repair [PDR] (42 Hail Impacts @ Oversize Rate) ............. $1,150.00",
                "2. Roof Panel & A-Pillar Precision Dent Removal .................................. $950.00",
                "3. OEM Acoustic Solar Windshield Replacement & ADAS Sensor Calibration ........... $880.00",
                "4. Right Front Fender Blending & Clear Coat Refinish ............................. $220.00"
            ]),
            ("AUDIT VERIFICATION:", [
                "- Scanned with computerized matrix gauge. No frame structural distortion observed."
            ])
        ],
        total_line="TOTAL VEHICLE REPAIR APPRAISAL (RCV): $3,200.00",
        footer="Master Certified Estimator: Carlos Ramirez, I-CAR Cert #IC-99210"
    )

    # 5. Restaurant Commercial Spoilage Invoice PDF ($24,500.00)
    create_pdf(
        os.path.join(docs_dir, "Restaurant_Spoilage_Loss_Claim.pdf"),
        title="METRO COMMERCIAL REFRIGERATION & LOSS AUDIT",
        subtitle="Commercial Kitchen Equipment Diagnostics & Spoilage Valuation",
        metadata=[
            "Business Name:  Bistro Milano Restaurant Group  Policy Number: POL-119482",
            "Location:       512 Grand Avenue, Suite 100     Date of Loss:  August 26, 2026",
            "Peril Category: Mechanical Breakdown & Food Spoilage Endorsement"
        ],
        sections=[
            ("REFRIGERATION FAILURE & INVENTORY LOSS:", [
                "1. Walk-In Cooler 5HP Copeland Scroll Compressor Replacement & R448A Gas ......... $4,800.00",
                "2. Spoilage: Certified Prime Beef & Seafood Inventory (Invoice Verified) .......... $12,400.00",
                "3. Spoilage: Dairy, Cheeses & Temperature-Sensitive Specialty Produce ........... $3,800.00",
                "4. Certified Hazardous Organic Spoilage Disposal & Sanitization Fee .............. $1,500.00",
                "5. Business Interruption Loss (48 Hours Mandatory Closure Period) ................ $2,000.00"
            ]),
            ("DIAGNOSTIC LOG:", [
                "- Compressor electrical winding burnout confirmed. Loss date temperature logged at 68 deg F."
            ])
        ],
        total_line="TOTAL COMMERCIAL LOSS CLAIM (RCV): $24,500.00",
        footer="Commercial Refrigeration Lead Tech: Gregory Brooks, EPA Universal #88291"
    )

    # 6. Comprehensive Policy Schedule PDF
    create_pdf(
        os.path.join(docs_dir, "Property_Policy_POL994821.pdf"),
        title="SENTINEL MUTUAL PROPERTY & CASUALTY INSURANCE",
        subtitle="Policy Declarations Page & Endorsement Schedule",
        metadata=[
            "Named Insured:  Jane Doe                        Policy Number: POL-994821",
            "Effective:      Jan 01, 2026 to Jan 01, 2027    Policy Form:   HO-3 Special Dwelling",
            "Insured Risk:   742 Evergreen Terrace           Agent Code:    AG-88210"
        ],
        sections=[
            ("SECTION I - COVERAGE LIMITS:", [
                "Coverage A - Dwelling Building Limit ............................................. $500,000.00",
                "Coverage B - Other Structures Limit (10%) ....................................... $50,000.00",
                "Coverage C - Personal Property Contents Limit (50%) .............................. $250,000.00",
                "Coverage D - Loss of Use / Additional Living Expenses (20%) ...................... $100,000.00"
            ]),
            ("DEDUCTIBLE SCHEDULE & ENDORSEMENTS:", [
                "- Standard Property Damage Deductible: $1,000.00 per occurrence.",
                "- Endorsement HO-0422: Sudden & Accidental Water Discharge (Included).",
                "- Endorsement HO-0350: Replacement Cost Value [RCV] Settlement Provision."
            ])
        ],
        total_line="AGGREGATE POLICY LIMIT CAPACITY: $900,000.00",
        footer="Underwriting Officer: Elizabeth Vance | Sentinel Mutual Insurance Group"
    )

    print(f"\nAll 6 demo documents generated in pure PDF format in:\n{docs_dir}")


if __name__ == "__main__":
    generate_all_pdfs()
