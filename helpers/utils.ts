export const statusToColor = (status: number) => {
    if (status >= 200 && status < 300) {
        return "#81C784"
    } else if (status >= 300 && status < 400) {
        return "#FFE082";
    } else if (status >= 400 && status < 500) {
        return "#EF5350";
    } else if (status >= 500) {
        return "#7986CB";
    }
    return "#7986CB";
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

