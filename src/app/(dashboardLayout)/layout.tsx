"use client";

import Header from "@/components/Header";
import VLibras from "@/components/Vlibras";
import { MAX_CONTAINER_WIDTH } from "@/utils/constants";
import { Layout } from "antd";
import Script from "next/script";
import React from "react";

const { Content } = Layout;

// Declarar para o TS
declare global {
	interface Window {
		VLibras: any;
	}
}

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			{/* Carregando o script do VLibras */}
			<Script
				src="https://vlibras.gov.br/app/vlibras-plugin.js"
				strategy="afterInteractive"
				onLoad={() => {
					if (window.VLibras) {
						new window.VLibras.Widget("https://vlibras.gov.br/app");
					}
				}}
			/>

			<Layout style={{ minHeight: "100vh" }}>
				<Layout>
					<Header />
					<Content
						style={{
							margin: "8px",
							background: "#fff",
							padding: "16px",
							display: "flex",
							alignItems: "center",
							flexDirection: "column",
						}}
					>
						<div
							style={{
								width: "100%",
								maxWidth: MAX_CONTAINER_WIDTH,
							}}
						>
							{children}
						</div>
					</Content>
				</Layout>

				<VLibras />
			</Layout>
		</>
	);
}
