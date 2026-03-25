import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/theme-provider";

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
	const activeTab = "Account";
	const avatarUrl =
		"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80";

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
							>
								{tab}
								{activeTab === tab && (
									<span className="absolute inset-x-0 -bottom-[1px] h-0.5 rounded-full bg-foreground" />
								)}
							</button>
						))}
					</nav>
				</header>

				<section className="overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-lg backdrop-blur">
					<div className="flex items-center gap-4 border-b border-border/60 bg-card/70 px-8 py-6">
						<div className="h-14 w-14 overflow-hidden rounded-full border border-border">
							<img
								src={avatarUrl}
								alt="Profile avatar"
								className="h-full w-full object-cover"
							/>
						</div>
						<div className="space-y-1">
							<p className="text-lg font-semibold leading-tight">Chiko</p>
							<p className="text-sm text-muted-foreground">
								haycuoinhieuhon1412@gmail.com
							</p>
						</div>
					</div>

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
			</div>
		</div>
	);
}

