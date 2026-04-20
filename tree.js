const fs = require("fs");
const path = require("path");

// ===== CONFIG =====
const ROOT = process.argv[2] || ".";
const IGNORE = ["node_modules", ".git"]; // thêm tùy ý
// ==================

function isIgnored(name) {
  return IGNORE.includes(name);
}

function printTree(dir, prefix = "") {
  let items;
  try {
    items = fs.readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    console.error(prefix + "⚠️ Cannot access:", dir);
    return;
  }

  // lọc bỏ thư mục ignore ngay từ đầu (không traversal)
  items = items.filter(item => !isIgnored(item.name));

  items.forEach((item, index) => {
    const isLast = index === items.length - 1;
    const connector = isLast ? "└── " : "├── ";
    const fullPath = path.join(dir, item.name);

    console.log(prefix + connector + item.name);

    if (item.isDirectory()) {
      const nextPrefix = prefix + (isLast ? "    " : "│   ");
      printTree(fullPath, nextPrefix);
    }
  });
}

// ===== RUN =====
console.log(path.resolve(ROOT));
printTree(ROOT);