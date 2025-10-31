"use client";

import useSearchParamsHelper from "@/hooks/useSearchParamsHelper";
import { Routes } from "@/types/routes";
import { clearUser, getUser } from "@/utils/auth";
import { MAX_CONTAINER_WIDTH } from "@/utils/constants";
import { BellOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { User } from "@prisma/client";
import {
	Avatar,
	Badge,
	Button,
	Dropdown,
	Flex,
	Layout,
	Menu,
	MenuProps,
	Tooltip,
} from "antd";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
	const pathname = usePathname();
	const { redirect } = useSearchParamsHelper();

	const [notifications, setNotifications] = useState<[]>([]);
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const storedUser = getUser();
		if (storedUser) {
			setUser(storedUser);
		}
	}, []);

	const logout = () => {
		clearUser();
		redirect(Routes.LOGIN);
	};

	const goToProfile = () => {
		if (user?.id) {
			redirect(`${Routes.USERS}/${user.id}`);
		}
	};

	const handleMenuClick = (e: { key: string }) => {
		redirect(e.key);
	};

	const menuItems: MenuProps["items"] = [
		{ key: Routes.POSTS, label: "Publicações" },
		{ key: Routes.MY_POSTS, label: "Minhas Publicações" },
		{ key: Routes.TRADES, label: "Propostas" },
		{ key: "/addresses", label: "Endereços" },
	];

	const settings: MenuProps["items"] = [
		{
			key: "profile",
			label: "Meu perfil",
			icon: <UserOutlined />,
			onClick: goToProfile,
		},
		{ key: "logout", label: "Sair", icon: <LogoutOutlined />, onClick: logout },
	];

	return (
		<Layout.Header
			style={{
				padding: "0 16px",
				width: "100%",
				height: "50px",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Flex
				align="center"
				justify="space-between"
				gap={16}
				style={{
					width: "100%",
					maxWidth: MAX_CONTAINER_WIDTH,
				}}
			>
				<Flex align="center" justify="center" style={{ flex: 1 }}>
					<Menu
						className="custom-header-menu"
						mode="horizontal"
						theme="dark"
						selectedKeys={[pathname]}
						onClick={handleMenuClick}
						items={menuItems}
						style={{
							borderBottom: "none",
							height: "20px",
							flex: 1,
							minWidth: 0,
							display: "flex",
							gap: 8,
							alignItems: "center",
							justifyContent: "center",
						}}
					/>
				</Flex>

				<div>
					<Flex align="center" gap={8}>
						<Tooltip title="Notificações">
							<Dropdown
								menu={{ items: notifications }}
								placement="bottomRight"
								trigger={["click"]}
							>
								<Badge
									count={notifications.length}
									overflowCount={99}
									size="small"
									offset={[0, 6]}
								>
									<Button
										color="default"
										variant="link"
										size="small"
										style={{ margin: 0, padding: 0 }}
										icon={
											<BellOutlined style={{ color: "#fff", fontSize: 18 }} />
										}
									/>
								</Badge>
							</Dropdown>
						</Tooltip>

						<Tooltip title="Meu perfil">
							<Dropdown
								menu={{ items: settings }}
								placement="bottomRight"
								trigger={["click"]}
							>
								<Avatar
									src={user?.avatarUrl}
									icon={!user?.avatarUrl && <UserOutlined />}
									style={{ cursor: "pointer" }}
								/>
							</Dropdown>
						</Tooltip>
					</Flex>
				</div>
			</Flex>
		</Layout.Header>
	);
}
