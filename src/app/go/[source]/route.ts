import { trackClick } from "@/lib/trackClick"

export async function GET(
  request: Request,
  { params }: { params: { source: string } }
) {
  return trackClick(params.source, request, "go")
}
