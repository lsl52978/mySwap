"use client";
import Link from "next/link";
import { FC } from "react";
import { usePathname } from "next/navigation";

// 导航项配置
const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Trading", href: "/trading/" },
  { label: "Liquidity", href: "/liquidity/" },
  { label: "History", href: "/history/" },
];

const NavBar: FC = () => {
  const pathname = usePathname(); // 获取当前路径

  return (
    <nav className="bg-primary text-white py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold hover:text-secondary">
          MySwap
        </Link>

        {/* 动态生成导航项 */}
        <div className="flex items-center space-x-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-base font-medium hover:text-secondary ${
                pathname === item.href ? "text-secondary font-semibold" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
