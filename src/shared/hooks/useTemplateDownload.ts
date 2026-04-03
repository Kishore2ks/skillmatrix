import { useQuery } from "@tanstack/react-query";
import { createAndDownload } from "@/shared/utils/bulk-upload-validation";
import { useToast } from "@/shared/hooks/use-toast";
import type { TemplateResult } from "@/shared/types/common.types";

type ServiceFn = () => Promise<unknown>;

export function useTemplateDownload(
  serviceFn: ServiceFn,
  queryKey: readonly unknown[]
) {
  const { toast } = useToast();

  const query = useQuery<TemplateResult, Error>({
    queryKey,
    queryFn: async () => {
      const res = await serviceFn();
      const blob = (res as { data: Blob }).data as Blob;
      const headersObj: Record<string, string> = {};
      Object.entries(
        (res as { headers?: Record<string, unknown> }).headers || {}
      ).forEach(([k, v]) => {
        headersObj[k.toLowerCase()] = String(v);
      });
      return { blob, headers: headersObj };
    },
    enabled: false,
    staleTime: Infinity,
    retry: 1,
  });

  const download = async () => {
    try {
      const data = query.data ?? (await query.refetch()).data;
      if (!data) throw new Error("Failed to fetch template");
      await createAndDownload(data.blob, data.headers);
      return true;
    } catch (err) {
      console.error("Failed to download template", err);
      toast({
        title: "Error",
        description: "Failed to download template. Please try again later.",
        variant: "destructive",
      });
      return false;
    }
  };

  return { query, download } as const;
}
