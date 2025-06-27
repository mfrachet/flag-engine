import { NextRequest } from "next/server";
import { z } from "zod";

const HitSchema = z.object({
  name: z.string(),
  url: z.string(),
  referer: z.string().optional(),
  viewportWidth: z.number(),
  viewportHeight: z.number(),
  posX: z.number().optional(),
  posY: z.number().optional(),
  selector: z.string().optional(),
  data: z.string().optional(),
});

const HitsArraySchema = z.array(HitSchema);

export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ clientKey: string }> }
) => {
  try {
    const { clientKey } = await params;
    const body = await request.json();
    const validatedData = HitsArraySchema.parse(body);

    console.log({ clientKey, validatedData });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          error: "Invalid request data",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Handle other unexpected errors
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
