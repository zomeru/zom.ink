import { toast } from "react-hot-toast";

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard.");
  } catch (error) {
    toast.error("Failed to copy to clipboard.");
  }
};

export const downloadQRCode = (qrId: string) => {
  const svg = document.getElementById(qrId) as Node;
  const svgData = new XMLSerializer().serializeToString(svg);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.onload = function () {
    canvas.width = img.width + 40;
    canvas.height = img.height + 40;
    ctx?.strokeRect(0, 0, canvas.width, canvas.height);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ctx!.fillStyle = "#FFFFFF";
    ctx?.fillRect(0, 0, canvas.width, canvas.height);
    ctx?.drawImage(img, 20, 20);
    const pngFile = canvas.toDataURL("image/png");

    const downloadLink = document.createElement("a");
    downloadLink.download = qrId;
    downloadLink.href = `${pngFile}`;
    downloadLink.click();
  };

  img.src = "data:image/svg+xml;base64," + btoa(svgData);
};
