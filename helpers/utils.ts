export const statusToColor = (status: number) => {
    if (status >= 200 && status < 300) {
        return "text-success";
    } else if (status >= 300 && status < 400) {
        return "text-warning";
    } else if (status >= 400 && status < 500) {
        return "text-error";
    } else if (status >= 500) {
        return "text-error";
    }
    return "text-primary";
    }

export const bytesToHumanReadable = (bytes: number) => {
    let value = 0, unit = "";
    if (bytes >= 1000000000) {
      value = bytes / 1000000000;
      unit = "GB";
    } else if (bytes >= 1000000) {
      value = bytes / 1000000;
      unit = "MB";
    } else if (bytes >= 1000) {
      value = bytes / 1000;
      unit = "KB";
    } else {
      value = bytes;
      unit = "B";
    }
    return {value:parseFloat(value.toFixed(2)), unit};
}

