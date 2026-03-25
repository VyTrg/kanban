import { ThemeToggle } from "@/components/theme/theme-provider";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* TopNavBar */}
      <nav className="bg-background border-b border-border fixed top-0 w-full z-50 flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-6">
          <span className="text-sm font-bold tracking-tight">The Digital Curator</span>
          <div className="hidden md:flex items-center gap-4">
            <a className="text-sm font-medium text-foreground" href="#">
              Account
            </a>
            <a className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" href="#">
              Workspace
            </a>
            <a className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" href="#">
              Permissions
            </a>
            <a className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" href="#">
              Billing
            </a>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="ml-2 w-8 h-8 rounded-full border border-border overflow-hidden">
            <img
              className="w-full h-full object-cover"
              alt="Avatar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeRbR1b_sekfcOVokal4uBSd9XMI4nUNhPisSK94MPvHhr1ka8of-F6KoFalxnTIfNeZZ8e7bWltdz6jFO6GbU2r-T8uPmUOJzJQ3_9wIVrP5eqWoY-8eUrD4z0U8n8wZyol6UCK46smgm1KGdW7RmaC-6DpxwyemLsLkOEOqP4Zb8dMT5gQ1osX5EZ8o2lQ8tuYOXW_c_g6VYdLDslyEa78dXhK1z1_edIIDi1Fx7q_BvBiVFHNsRBOJTCaISJyewckILj-Lxf0k"
            />
          </div>
        </div>
      </nav>

      {/* Sidebar Wrapper */}
      <aside className="bg-background border-r border-border h-screen w-64 fixed left-0 top-0 z-40 flex flex-col pt-20 pb-6">
        <div className="px-6 mb-4">
          <h2 className="text-sm font-semibold tracking-tight text-foreground">Settings</h2>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          <a className="flex items-center gap-3 px-3 py-2 rounded-md bg-accent text-accent-foreground text-sm font-medium" href="#">
            <span className="material-symbols-outlined">person</span>
            <span>Personal Info</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground text-sm font-medium transition-colors" href="#">
            <span className="material-symbols-outlined">shield</span>
            <span>Security</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground text-sm font-medium transition-colors" href="#">
            <span className="material-symbols-outlined">notifications</span>
            <span>Notifications</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground text-sm font-medium transition-colors" href="#">
            <span className="material-symbols-outlined">apps</span>
            <span>Connected Apps</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground text-sm font-medium transition-colors" href="#">
            <span className="material-symbols-outlined">tune</span>
            <span>Preferences</span>
          </a>
        </nav>
        <div className="px-6 mt-auto">
          <button className="w-full py-2 px-4 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors">
            Upgrade to Pro
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 mt-14 p-10 min-h-screen bg-background">
        <div className="max-w-3xl mx-auto">
          <header className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1.5">
              Account Settings
            </h1>
            <p className="text-muted-foreground">
              Update your profile information and digital preferences.
            </p>
          </header>

          <div className="space-y-10">
            {/* Profile Picture Section */}
            <section className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border border-border overflow-hidden bg-muted">
                  <img
                    className="w-full h-full object-cover"
                    alt="Avatar"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUx6MLocsx51Omsh8SixJbD7u86jUmEPxW6UDdC8qoSSKFRXj1U-SfPnZQqjIawaSJTHy-I6RBL9CPcPL-Wh68ikqXupBVMCZA7KhjI76gtciSgZr04C82hUH3QeteYEflOpVuD6sBosJ79oEk_oXd0Anv5e0iXqunmGtjFdwhfvP22Y_KwdeTB-clMiyVoiA4VVU4HIZs85nRDlGiFYAYRJgLsrnb6pQT_79u6UkKbg0r8IGluXKg6WnfYGjm3wV4HmSE20n6bSg"
                  />
                </div>
                <button className="absolute -bottom-1 -right-1 bg-background border border-border text-foreground p-1.5 rounded-full shadow-sm hover:bg-accent transition-colors">
                  <span className="material-symbols-outlined !text-[16px]">edit</span>
                </button>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Profile Picture</h3>
                <p className="text-muted-foreground text-sm mt-0.5 mb-3">
                  Recognizable across the workspace.
                </p>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-secondary text-secondary-foreground text-xs font-medium rounded-md hover:bg-secondary/80 transition-colors">
                    Upload Photo
                  </button>
                  <button className="px-3 py-1.5 text-muted-foreground hover:text-destructive text-xs font-medium transition-colors">
                    Remove
                  </button>
                </div>
              </div>
            </section>

            {/* Form Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Display Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Display name
                </label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  type="text"
                  defaultValue="Chiko"
                />
                <p className="text-[0.8rem] text-muted-foreground">
                  Visible to all workspace members.
                </p>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Email address</label>
                <div className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                  <span>haycuoinhieuhon1412@gmail.com</span>
                  <span
                    className="material-symbols-outlined !text-primary !text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                </div>
              </div>

              {/* Language Dropdown */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Language</label>
                <div className="relative">
                  <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none">
                    <option defaultValue="English">English</option>
                    <option>Vietnamese</option>
                    <option>Japanese</option>
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined pointer-events-none text-muted-foreground">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Font Size Dropdown */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Font size</label>
                <div className="relative">
                  <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none">
                    <option>Small</option>
                    <option defaultValue="Medium">Medium</option>
                    <option>Large</option>
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined pointer-events-none text-muted-foreground">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            {/* Experience Preferences */}
            <section className="rounded-lg border border-border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold leading-none tracking-tight">
                    Experience Preferences
                  </h3>
                  <span className="inline-flex items-center rounded-full border border-transparent bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    Experimental
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Customize how The Digital Curator feels to you.
                </p>
              </div>
              <div className="p-6 pt-0 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1 p-4 rounded-md border border-border bg-accent/50 hover:bg-accent transition-colors cursor-pointer group">
                  <span className="material-symbols-outlined text-primary mb-1">dark_mode</span>
                  <span className="text-sm font-medium">Deep Focus</span>
                  <span className="text-xs text-muted-foreground">Full dark theme</span>
                </div>
                <div className="flex flex-col gap-1 p-4 rounded-md border border-border hover:bg-accent transition-colors cursor-pointer group">
                  <span className="material-symbols-outlined text-muted-foreground group-hover:text-primary mb-1">
                    motion_photos_off
                  </span>
                  <span className="text-sm font-medium">Reduce Motion</span>
                  <span className="text-xs text-muted-foreground">Fewer animations</span>
                </div>
                <div className="flex flex-col gap-1 p-4 rounded-md border border-border hover:bg-accent transition-colors cursor-pointer group">
                  <span className="material-symbols-outlined text-muted-foreground group-hover:text-primary mb-1">
                    view_compact
                  </span>
                  <span className="text-sm font-medium">Compact View</span>
                  <span className="text-xs text-muted-foreground">Higher density</span>
                </div>
              </div>
            </section>

            {/* Action Footer */}
            <footer className="flex items-center justify-end gap-3 pt-6 border-t border-border">
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                Discard
              </button>
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2">
                Save Changes
              </button>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}

