-- =============================================================================
-- MPLADS SENTINEL - SUPABASE DATABASE SEED DATA
-- SIH Problem: SIH26102 | Ministry of Statistics and Programme Implementation
-- Run this script in Supabase SQL Editor to populate sample projects, evidence,
-- investigations, geographic risk points, and national analytics.
-- =============================================================================

-- 1. SEED PROJECTS
INSERT INTO public.projects (
  id, title, category, state, district, constituency, mp_name, mp_house, 
  implementing_agency, status, financial_progress, physical_progress, 
  financials, dates, gps_coordinates, risk, milestones, investigation_case_id
) VALUES 
(
  'MPL-004821',
  'Construction of Multipurpose Community Hall at Village Khera',
  'Community Infrastructure',
  'Delhi',
  'New Delhi',
  'New Delhi PC-04',
  'Smt. Meenakshi Lekhi',
  'Lok Sabha',
  'Delhi State Industrial and Infrastructure Development Corp (DSIIDC)',
  'in_progress',
  88,
  52,
  '{"recommendedAmount": 3500000, "sanctionedAmount": 3500000, "committedAmount": 3500000, "paidDisbursedAmount": 3080000, "verifiedExpenditureAmount": 2920000, "unreconciledGap": 160000, "comparableMedianAmount": 2660000, "costDeviationPercent": 31.4}'::jsonb,
  '{"recommendedDate": "2025-08-15", "sanctionedDate": "2025-10-10", "workOrderDate": "2025-10-28", "expectedCompletionDate": "2026-06-30"}'::jsonb,
  '{"latitude": 28.5832, "longitude": 77.1645}'::jsonb,
  '{"score": 87, "level": "critical", "primarySignal": "Severe Financial / Physical Progress Divergence (36% Gap) & Reused Foundation Photo", "confidence": 0.94, "breakdown": {"financialAnomalyScore": 28, "timelineMilestoneDelayScore": 18, "visualIntegrityScore": 24, "documentExtractionScore": 12, "graphRelationshipScore": 0, "duplicateScopeScore": 5}}'::jsonb,
  '[{"id": "M1", "sequence": 1, "name": "Site Clearance & Excavation", "status": "completed", "disbursedAmount": 700000, "completionPercentage": 100}, {"id": "M2", "sequence": 2, "name": "Foundation & Plinth Casting", "status": "completed", "disbursedAmount": 1050000, "completionPercentage": 100}, {"id": "M3", "sequence": 3, "name": "Superstructure Masonry & Columns", "status": "delayed", "disbursedAmount": 1330000, "completionPercentage": 40}, {"id": "M4", "sequence": 4, "name": "RCC Roof Slab Casting", "status": "pending", "disbursedAmount": 0, "completionPercentage": 0}, {"id": "M5", "sequence": 5, "name": "Finishing, Electrification & Handover", "status": "pending", "disbursedAmount": 0, "completionPercentage": 0}]'::jsonb,
  'CASE-2026-00128'
),
(
  'MPL-004822',
  'Construction of Community Centre at Village Khera Extension',
  'Community Infrastructure',
  'Delhi',
  'New Delhi',
  'New Delhi PC-04',
  'Smt. Meenakshi Lekhi',
  'Lok Sabha',
  'Delhi State Industrial and Infrastructure Development Corp (DSIIDC)',
  'in_progress',
  60,
  45,
  '{"recommendedAmount": 3800000, "sanctionedAmount": 3800000, "committedAmount": 3800000, "paidDisbursedAmount": 2280000, "verifiedExpenditureAmount": 2100000, "unreconciledGap": 180000, "comparableMedianAmount": 2750000, "costDeviationPercent": 38.2}'::jsonb,
  '{"recommendedDate": "2025-09-02", "sanctionedDate": "2025-11-14", "workOrderDate": "2025-12-01", "expectedCompletionDate": "2026-08-15"}'::jsonb,
  '{"latitude": 28.5865, "longitude": 77.1680}'::jsonb,
  '{"score": 76, "level": "high", "primarySignal": "Potential Scope Duplication & Spatial Overlap with MPL-004821 (<450m Distance)", "confidence": 0.89, "breakdown": {"financialAnomalyScore": 16, "timelineMilestoneDelayScore": 10, "visualIntegrityScore": 12, "documentExtractionScore": 8, "graphRelationshipScore": 10, "duplicateScopeScore": 20}}'::jsonb,
  '[]'::jsonb,
  NULL
),
(
  'MPL-005104',
  'Installation of 50 High-Mast Solar Lighting Systems',
  'Renewable Energy & Lighting',
  'Uttar Pradesh',
  'Varanasi',
  'Varanasi PC-77',
  'Shri Narendra Modi',
  'Lok Sabha',
  'Uttar Pradesh New & Renewable Energy Development Agency (UPNEDA)',
  'in_progress',
  92,
  40,
  '{"recommendedAmount": 4500000, "sanctionedAmount": 4500000, "committedAmount": 4500000, "paidDisbursedAmount": 4140000, "verifiedExpenditureAmount": 3950000, "unreconciledGap": 190000, "comparableMedianAmount": 3200000, "costDeviationPercent": 40.6}'::jsonb,
  '{"recommendedDate": "2025-06-10", "sanctionedDate": "2025-07-20", "workOrderDate": "2025-08-05", "expectedCompletionDate": "2026-02-28"}'::jsonb,
  '{"latitude": 25.3176, "longitude": 82.9739}'::jsonb,
  '{"score": 79, "level": "high", "primarySignal": "Vendor Price Markup (+40.6% over Benchmark) & Progress Lag", "confidence": 0.91, "breakdown": {"financialAnomalyScore": 24, "timelineMilestoneDelayScore": 18, "visualIntegrityScore": 8, "documentExtractionScore": 9, "graphRelationshipScore": 20, "duplicateScopeScore": 0}}'::jsonb,
  '[]'::jsonb,
  'CASE-2026-00129'
),
(
  'MPL-003940',
  'Augmentation of Rural Drinking Water Pipeline & Overhead Tank',
  'Drinking Water & Sanitation',
  'Rajasthan',
  'Jaipur',
  'Jaipur Rural PC-06',
  'Col. Rajyavardhan Singh Rathore',
  'Lok Sabha',
  'Public Health Engineering Department (PHED Rajasthan)',
  'delayed',
  75,
  30,
  '{"recommendedAmount": 5200000, "sanctionedAmount": 5200000, "committedAmount": 5200000, "paidDisbursedAmount": 3900000, "verifiedExpenditureAmount": 3720000, "unreconciledGap": 180000, "comparableMedianAmount": 4800000, "costDeviationPercent": 8.3}'::jsonb,
  '{"recommendedDate": "2024-11-12", "sanctionedDate": "2025-01-20", "workOrderDate": "2025-02-10", "expectedCompletionDate": "2025-10-31"}'::jsonb,
  '{"latitude": 26.9124, "longitude": 75.7873}'::jsonb,
  '{"score": 83, "level": "critical", "primarySignal": "Prolonged Project Stall (45% Physical-Financial Divergence & Stagnant Tank)", "confidence": 0.92, "breakdown": {"financialAnomalyScore": 22, "timelineMilestoneDelayScore": 30, "visualIntegrityScore": 15, "documentExtractionScore": 6, "graphRelationshipScore": 0, "duplicateScopeScore": 10}}'::jsonb,
  '[]'::jsonb,
  NULL
),
(
  'MPL-006218',
  'Modern Smart Classrooms & Digital Lab in Govt Senior Secondary School',
  'Education & Smart Classrooms',
  'Maharashtra',
  'Pune',
  'Pune PC-34',
  'Shri Murlidhar Mohol',
  'Lok Sabha',
  'Maharashtra Public Works Department (PWD Pune Circle)',
  'completed',
  100,
  100,
  '{"recommendedAmount": 2800000, "sanctionedAmount": 2800000, "committedAmount": 2800000, "paidDisbursedAmount": 2800000, "verifiedExpenditureAmount": 2785000, "unreconciledGap": 15000, "comparableMedianAmount": 2750000, "costDeviationPercent": 1.8}'::jsonb,
  '{"recommendedDate": "2025-04-10", "sanctionedDate": "2025-05-15", "workOrderDate": "2025-06-01", "expectedCompletionDate": "2025-11-30"}'::jsonb,
  '{"latitude": 18.5204, "longitude": 73.8567}'::jsonb,
  '{"score": 14, "level": "low", "primarySignal": "Exemplary Execution within Sanctioned Schedule & Cost", "confidence": 0.98, "breakdown": {"financialAnomalyScore": 2, "timelineMilestoneDelayScore": 0, "visualIntegrityScore": 0, "documentExtractionScore": 2, "graphRelationshipScore": 5, "duplicateScopeScore": 5}}'::jsonb,
  '[]'::jsonb,
  NULL
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  state = EXCLUDED.state,
  district = EXCLUDED.district,
  constituency = EXCLUDED.constituency,
  mp_name = EXCLUDED.mp_name,
  mp_house = EXCLUDED.mp_house,
  implementing_agency = EXCLUDED.implementing_agency,
  status = EXCLUDED.status,
  financial_progress = EXCLUDED.financial_progress,
  physical_progress = EXCLUDED.physical_progress,
  financials = EXCLUDED.financials,
  dates = EXCLUDED.dates,
  gps_coordinates = EXCLUDED.gps_coordinates,
  risk = EXCLUDED.risk,
  milestones = EXCLUDED.milestones,
  investigation_case_id = EXCLUDED.investigation_case_id,
  updated_at = NOW();

-- 2. SEED INVESTIGATIONS
INSERT INTO public.investigations (
  id, project_id, project_title, state, district, category, risk_score, 
  primary_issue, priority, status, summary, assigned_to, notes, activity_logs, evidence_chain
) VALUES 
(
  'CASE-2026-00128',
  'MPL-004821',
  'Construction of Multipurpose Community Hall at Village Khera',
  'Delhi',
  'New Delhi',
  'Community Infrastructure',
  87,
  'Severe Financial / Physical Progress Divergence (36% Gap) & Reused Foundation Photo',
  'urgent',
  'under_review',
  'Automated Sentinel multi-modal audit flagged work MPL-004821. Executing agency drew 88% of sanctioned funds (₹30.80 L), but physical inspection verifies only 52% completion. Site photo submitted for Milestone 2 matches an image uploaded in March 2024 for MPL-002419 with 99.4% perceptual similarity.',
  '{"officerId": "INV-OFFICER-009", "name": "Priya Verma", "designation": "Senior Vigilance Officer", "cell": "Northern Zone Audit Cell"}'::jsonb,
  '[{"id": "NOTE-001", "author": "Dr. Ananya Sharma (MoSPI)", "text": "Discrepancy escalated based on 36% financial/physical divergence. Ordered physical verification.", "timestamp": "2026-02-18T10:15:00Z"}]'::jsonb,
  '[{"action": "CASE_OPENED", "actor": "Sentinel Automated Surveillance Grid", "timestamp": "2026-02-17T08:30:00Z", "details": "Triggered by Mod 08 (Divergence: 36%) & Mod 13 (Image Match: 99.4%)"}]'::jsonb,
  '["EVD-IMG-001", "EVD-PAY-001", "EVD-DOC-003"]'::jsonb
),
(
  'CASE-2026-00129',
  'MPL-005104',
  'Installation of 50 High-Mast Solar Lighting Systems',
  'Uttar Pradesh',
  'Varanasi',
  'Renewable Energy & Lighting',
  79,
  'Vendor Price Markup (+40.6% over Benchmark) & Progress Lag',
  'high',
  'new',
  'Vendor concentration audit flagged procurement rates for solar light fixtures. Unit rate billed at ₹90,000 against state schedule of rates median of ₹64,000.',
  '{"officerId": "INV-OFFICER-014", "name": "Amitabh Sen", "designation": "Technical Audit Officer", "cell": "UP State Nodal Inspection Unit"}'::jsonb,
  '[]'::jsonb,
  '[{"action": "CASE_OPENED", "actor": "Sentinel Automated Surveillance Grid", "timestamp": "2026-02-19T11:45:00Z", "details": "Triggered by Mod 05 (Cost Outlier) & Mod 10 (Vendor Concentration)"}]'::jsonb,
  '["EVD-DOC-004"]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  project_title = EXCLUDED.project_title,
  risk_score = EXCLUDED.risk_score,
  primary_issue = EXCLUDED.primary_issue,
  priority = EXCLUDED.priority,
  status = EXCLUDED.status,
  summary = EXCLUDED.summary,
  assigned_to = EXCLUDED.assigned_to,
  notes = EXCLUDED.notes,
  activity_logs = EXCLUDED.activity_logs,
  evidence_chain = EXCLUDED.evidence_chain,
  updated_at = NOW();

-- 3. SEED EVIDENCE
INSERT INTO public.evidence (
  id, project_id, project_title, type, title, status, file_url, thumbnail_url,
  file_size, mime_type, provenance, metadata, extracted_fields, findings,
  comparison_evidence_id, comparison_similarity_percent
) VALUES
(
  'EVD-IMG-001',
  'MPL-004821',
  'Multipurpose Community Hall at Village Khera',
  'image',
  'Foundation Footing Concrete Pouring Inspection Photo',
  'conflict',
  'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=300&q=80',
  '3.4 MB',
  'image/jpeg',
  '{"sourceSystem": "eSAKSHI Mobile Inspection App v2.4", "uploaderId": "AE-NEWDELHI-04", "uploaderRole": "Assistant Engineer (Civil), DSIIDC", "uploadedAt": "2025-11-20T14:32:11Z", "sha256Hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}'::jsonb,
  '{"cameraModel": "Samsung SM-G991B", "dateTimeOriginal": "2024-03-12 11:22:45", "exifGpsLatitude": 28.5834, "exifGpsLongitude": 77.1642, "altitude": 218.4, "flashUsed": false}'::jsonb,
  '[]'::jsonb,
  '[{"id": "F-01", "dimension": "Visual Integrity", "severity": "critical", "message": "Perceptual Image Hash (dHash) matches 99.4% with historic photo EVD-HIST-0894 uploaded in March 2024 for different project MPL-002419.", "confidence": 0.994}]'::jsonb,
  'EVD-HIST-0894',
  99.4
),
(
  'EVD-DOC-003',
  'MPL-004821',
  'Multipurpose Community Hall at Village Khera',
  'document',
  '3rd Running Account (RA) Bill & Measurement Sheet',
  'conflict',
  'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=300&q=80',
  '4.1 MB',
  'application/pdf',
  '{"sourceSystem": "DSIIDC Contractor Billing Portal", "uploaderId": "CONT-DSIIDC-99", "uploaderRole": "Registered Class-1 Contractor", "uploadedAt": "2026-01-14T16:05:22Z", "sha256Hash": "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"}'::jsonb,
  '{"pageCount": 6, "hasDigitalSignature": true, "signatoryName": "Er. R.K. Srivastava", "signingTime": "2026-01-14 15:58:10"}'::jsonb,
  '[{"fieldName": "Claimed Slab Concrete Volume", "extractedValue": "142.5 cu.m", "isConsistent": false, "inconsistencyDetail": "Measurement book entry shows plinth level casting; slab casting not started on site."}]'::jsonb,
  '[{"id": "F-02", "dimension": "Document Extraction", "severity": "high", "message": "Billed line item RCC roof slab casting claimed as 100% complete prior to physical superstructure completion.", "confidence": 0.91}]'::jsonb,
  NULL,
  NULL
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  file_url = EXCLUDED.file_url,
  thumbnail_url = EXCLUDED.thumbnail_url,
  file_size = EXCLUDED.file_size,
  mime_type = EXCLUDED.mime_type,
  provenance = EXCLUDED.provenance,
  metadata = EXCLUDED.metadata,
  extracted_fields = EXCLUDED.extracted_fields,
  findings = EXCLUDED.findings,
  comparison_evidence_id = EXCLUDED.comparison_evidence_id,
  comparison_similarity_percent = EXCLUDED.comparison_similarity_percent,
  updated_at = NOW();

-- 4. SEED NATIONAL ANALYTICS
INSERT INTO public.national_analytics (
  id, total_works_monitored, total_sanctioned_cr, total_disbursed_cr, 
  total_flagged_risk_value_cr, risk_counts, risk_trend_7d, risk_trend_30d, risk_distribution
) VALUES (
  'national_summary',
  18432,
  4892.4,
  3715.8,
  42.8,
  '{"critical": 34, "high": 127, "medium": 842, "low": 17429}'::jsonb,
  '[{"day": "Mon", "critical": 2, "high": 8, "cleared": 14}, {"day": "Tue", "critical": 4, "high": 12, "cleared": 18}, {"day": "Wed", "critical": 1, "high": 6, "cleared": 9}, {"day": "Thu", "critical": 5, "high": 15, "cleared": 22}, {"day": "Fri", "critical": 3, "high": 9, "cleared": 16}, {"day": "Sat", "critical": 0, "high": 4, "cleared": 11}, {"day": "Sun", "critical": 1, "high": 3, "cleared": 8}]'::jsonb,
  '[]'::jsonb,
  '[{"tier": "Low Risk (0-39)", "count": 17429, "percent": 94.6}, {"tier": "Medium Risk (40-69)", "count": 842, "percent": 4.6}, {"tier": "High Risk (70-84)", "count": 127, "percent": 0.7}, {"tier": "Critical Risk (85-100)", "count": 34, "percent": 0.2}]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  total_works_monitored = EXCLUDED.total_works_monitored,
  total_sanctioned_cr = EXCLUDED.total_sanctioned_cr,
  total_disbursed_cr = EXCLUDED.total_disbursed_cr,
  total_flagged_risk_value_cr = EXCLUDED.total_flagged_risk_value_cr,
  risk_counts = EXCLUDED.risk_counts,
  risk_trend_7d = EXCLUDED.risk_trend_7d,
  risk_distribution = EXCLUDED.risk_distribution,
  updated_at = NOW();

-- 5. SEED STATE METRICS
INSERT INTO public.state_metrics (
  state, total_works, total_sanctioned_cr, total_expenditure_cr, 
  high_risk_works, critical_works, average_risk_score, primary_risk_factor
) VALUES 
('Rajasthan', 1420, 385.4, 290.1, 14, 5, 24.8, 'Timeline Slippage & Milestone Stall'),
('Delhi', 840, 215.2, 182.4, 18, 6, 29.4, 'Physical-Financial Progress Divergence'),
('Uttar Pradesh', 3250, 890.5, 680.2, 28, 8, 26.2, 'Vendor Rate Outliers & Structuring'),
('Maharashtra', 2180, 595.0, 470.8, 12, 3, 19.5, 'Slight Timeline Delays'),
('Bihar', 1890, 480.2, 340.5, 22, 7, 28.1, 'Physical-Financial Progress Divergence')
ON CONFLICT (state) DO UPDATE SET
  total_works = EXCLUDED.total_works,
  total_sanctioned_cr = EXCLUDED.total_sanctioned_cr,
  total_expenditure_cr = EXCLUDED.total_expenditure_cr,
  high_risk_works = EXCLUDED.high_risk_works,
  critical_works = EXCLUDED.critical_works,
  average_risk_score = EXCLUDED.average_risk_score,
  primary_risk_factor = EXCLUDED.primary_risk_factor;

-- 6. SEED GEOGRAPHIC RISK POINTS
INSERT INTO public.geographic_risk_points (
  id, project_id, project_title, state, district, latitude, longitude, 
  risk_score, risk_level, primary_signal, sanctioned_amount, category
) VALUES
('GEO-001', 'MPL-004821', 'Multipurpose Community Hall at Village Khera', 'Delhi', 'New Delhi', 28.5832, 77.1645, 87, 'critical', '36% Physical-Financial Divergence & Reused Photo', 3500000, 'Community Infrastructure'),
('GEO-002', 'MPL-004822', 'Community Centre at Village Khera Extension', 'Delhi', 'New Delhi', 28.5865, 77.1680, 76, 'high', 'Spatial Overlap & Duplicate Scope (<450m)', 3800000, 'Community Infrastructure'),
('GEO-003', 'MPL-005104', '50 High-Mast Solar Lighting Systems', 'Uttar Pradesh', 'Varanasi', 25.3176, 82.9739, 79, 'high', 'Vendor Price Markup (+40.6%)', 4500000, 'Renewable Energy & Lighting'),
('GEO-004', 'MPL-003940', 'Augmentation of Rural Drinking Water Pipeline', 'Rajasthan', 'Jaipur', 26.9124, 75.7873, 83, 'critical', 'Prolonged Project Stall (45% Gap)', 5200000, 'Drinking Water & Sanitation')
ON CONFLICT (id) DO UPDATE SET
  project_title = EXCLUDED.project_title,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  risk_score = EXCLUDED.risk_score,
  risk_level = EXCLUDED.risk_level,
  primary_signal = EXCLUDED.primary_signal,
  sanctioned_amount = EXCLUDED.sanctioned_amount;
