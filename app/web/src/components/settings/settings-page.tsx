"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/theme-provider";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const tabs = [
	"Account",
	"Workspace",
	"Permissions",
	"Billing",
	"API",
	"Webhooks",
	"Integrations",
];

const languages = ["English", "Vietnamese", "Japanese"];
const fontSizes = ["Small", "Medium", "Large"];

export default function SettingsPage() {
	const [activeTab, setActiveTab] = useState<string>("Account");

	const renderContent = () => {
		switch (activeTab) {
			case "Workspace":
				return (
					<section className="overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-lg backdrop-blur">
						<div className="space-y-8 px-8 py-8">
							<div className="space-y-3">
								<Label htmlFor="workspace-name">Workspace name</Label>
								<Input
									id="workspace-name"
									defaultValue="vót bây"
									className="h-10 text-sm"
								/>
							</div>

							<div className="space-y-3">
								<Label htmlFor="workspace-url">Workspace URL</Label>
								<div className="grid gap-3 md:grid-cols-[1fr_2fr]">
									<Input
										id="workspace-url-prefix"
										defaultValue="kan.bn/"
										className="h-10 text-sm"
									/>
									<Input
										id="workspace-url"
										defaultValue="d4jo7qfwzayc"
										className="h-10 text-sm"
									/>
								</div>
							</div>

							<div className="space-y-3">
								<Label htmlFor="workspace-description">Workspace description</Label>
								<Input
									id="workspace-description"
									placeholder=""
									className="h-10 text-sm"
								/>
							</div>

							<div className="space-y-3">
								<Label htmlFor="week-start">Week start day</Label>
								<div className="relative max-w-xs">
									<select
										id="week-start"
										defaultValue="Monday"
										className="flex h-10 w-full appearance-none items-center rounded-lg border border-input bg-background px-3 text-sm text-foreground ring-offset-background transition focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
									>
										<option>Sunday</option>
										<option>Monday</option>
										<option>Tuesday</option>
										<option>Wednesday</option>
										<option>Thursday</option>
										<option>Friday</option>
										<option>Saturday</option>
									</select>
									<span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
										˅
									</span>
								</div>
							</div>

							<div className="flex flex-col gap-3 border-y border-border/60 py-6 md:flex-row md:items-center md:justify-between">
								<div className="space-y-1">
									<p className="text-sm font-medium">Email visibility</p>
									<p className="text-xs text-muted-foreground">
										Allow workspace members to see each other’s email addresses
									</p>
								</div>
								<button
									type="button"
									className="relative h-6 w-11 rounded-full border border-input bg-primary/80 transition-colors"
									aria-pressed="true"
								>
									<span className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-background shadow" />
								</button>
							</div>

							<div className="flex items-center justify-between">
								<Button variant="secondary" size="sm" className="gap-1.5">
									Upgrade to Pro
								</Button>
							</div>

							<div className="space-y-3 border-t border-border/60 pt-6">
								<p className="text-sm font-medium">Delete workspace</p>
								<p className="text-xs text-muted-foreground">
									Once you delete your workspace, there is no going back. This action cannot be undone.
								</p>
								<Button variant="destructive" size="sm" className="mt-2">
									Delete workspace
								</Button>
							</div>
						</div>
					</section>
				);
			case "Account":
			default:
				return (
					<section className="overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-lg backdrop-blur">
						<div className="space-y-8 px-8 py-8">
							<div className="space-y-3">
								<Label htmlFor="display-name">Display name</Label>
								<Input
									id="display-name"
									defaultValue="Chiko"
									className="h-10 text-sm"
								/>
								<p className="text-xs text-muted-foreground">
									Pick a name to be shown to other workspace members.
								</p>
							</div>

							<div className="space-y-2">
								<Label>Email</Label>
								<div className="flex items-center justify-between rounded-lg border border-input/60 bg-muted/20 px-3 py-2 text-sm text-foreground">
									<span className="text-muted-foreground">
										haycuoinhieuhon1412@gmail.com
									</span>
									<span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-300">
										Verified
									</span>
								</div>
							</div>

							<div className="grid gap-6 md:grid-cols-2">
								<div className="space-y-3">
									<Label htmlFor="language">Language</Label>
									<div className="relative">
										<select
											id="language"
											defaultValue="English"
											className="flex h-10 w-full appearance-none items-center rounded-lg border border-input bg-background px-3 text-sm text-foreground ring-offset-background transition focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
										>
											{languages.map((language) => (
												<option key={language}>{language}</option>
											))}
										</select>
										<span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
											˅
										</span>
									</div>
									<p className="text-xs text-muted-foreground">
										Choose your preferred language.
									</p>
								</div>

								<div className="space-y-3">
									<Label htmlFor="font-size">Font size</Label>
									<div className="relative">
										<select
											id="font-size"
											defaultValue="Medium"
											className="flex h-10 w-full appearance-none items-center rounded-lg border border-input bg-background px-3 text-sm text-foreground ring-offset-background transition focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
										>
											{fontSizes.map((font) => (
												<option key={font}>{font}</option>
											))}
										</select>
										<span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
											˅
										</span>
									</div>
									<p className="text-xs text-muted-foreground">
										Tune the interface to your comfort.
									</p>
								</div>
							</div>
						</div>
					</section>
				);
		}
	};

	return (
		<div className="min-h-screen bg-background text-foreground">
			<div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10">
				<header className="space-y-4">
					<div className="flex items-center justify-between gap-3">
						<h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
						<ThemeToggle className="h-9 w-9" />
					</div>
					<nav className="flex flex-wrap gap-6 text-sm text-muted-foreground">
						{tabs.map((tab) => (
							<button
								key={tab}
								type="button"
								className={cn(
									"relative pb-3 transition-colors",
									activeTab === tab
										? "text-foreground"
										: "hover:text-foreground"
								)}
								onClick={() => setActiveTab(tab)}
							>
								{tab}
								{activeTab === tab && (
									<span className="absolute inset-x-0 -bottom-[1px] h-0.5 rounded-full bg-foreground" />
								)}
							</button>
						))}
					</nav>
				</header>

				{renderContent()}
			</div>
		</div>
	);
}
