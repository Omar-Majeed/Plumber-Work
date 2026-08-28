/**
 * Launch-safety gate.
 *
 * Run with SITE_STAGE=production, this exits non-zero when any
 * production-visible content still requires client confirmation.
 * In the demo stage it reports and exits cleanly.
 */
import {
  formatValidationReport,
  validateContent,
} from "../src/lib/content-validation";
import { siteStage } from "../src/lib/site-config";

const result = validateContent(siteStage);

process.stdout.write(`${formatValidationReport(result)}\n`);

if (!result.ok) {
  process.stderr.write(
    "\nERROR: production content validation failed. Release blocked.\n",
  );
  process.exit(1);
}
