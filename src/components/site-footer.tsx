
'use client';

import { VITOBULogo } from "./icons";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path d="M22.46,6C21.71,6.33,20.9,6.56,20,6.69C20.76,6.24,21.36,5.55,21.64,4.71C20.91,5.14,20.12,5.45,19.28,5.63C18.58,4.88,17.58,4.36,16.46,4.36C14.33,4.36,12.6,6.09,12.6,8.22C12.6,8.52,12.63,8.81,12.7,9.09C9.39,8.93,6.58,7.44,4.64,5.2C4.3,5.78,4.1,6.48,4.1,7.24C4.1,8.6,4.81,9.81,5.85,10.55C5.19,10.53,4.58,10.36,4,10.08V10.13C4,12.1,5.4,13.75,7.3,14.14C7,14.22,6.68,14.26,6.34,14.26C6.08,14.26,5.83,14.24,5.59,14.19C6.12,15.79,7.56,16.95,9.32,16.98C7.94,18.06,6.19,18.72,4.27,18.72C3.96,18.72,3.65,18.7,3.34,18.64C4.94,19.7,6.86,20.36,8.94,20.36C16.45,20.36,20.21,14.44,20.21,9.45V8.94C21,8.36,21.78,7.6,22.46,6Z" />
        </svg>
    )
}

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.492.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
        </svg>
    )
}

export function SiteFooter() {
    return (
        <footer className="border-t bg-muted">
            <div className="container py-12">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
                    <div className="col-span-2 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <VITOBULogo className="h-8 w-8 text-primary" />
                            <span className="font-bold text-lg">VITOBU</span>
                        </div>
                         <p className="max-w-xs text-muted-foreground">
                            A modern solution for university attendance management.
                        </p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-foreground">Product</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#features" className="text-muted-foreground hover:text-foreground">Features</a></li>
                            <li><a href="#how-it-works" className="text-muted-foreground hover:text-foreground">How it Works</a></li>
                            <li><a href="#faq" className="text-muted-foreground hover:text-foreground">FAQ</a></li>
                        </ul>
                    </div>
                     <div>
                        <h3 className="font-semibold text-foreground">Company</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" className="text-muted-foreground hover:text-foreground">About Us</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-foreground">Contact</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</a></li>
                        </ul>
                    </div>
                    <div className="col-span-2 md:col-span-1" id="newsletter">
                        <h3 className="font-semibold text-foreground">Stay Updated</h3>
                        <p className="text-muted-foreground mt-4 text-sm">Join our newsletter to get the latest updates.</p>
                        <form className="flex flex-col w-full max-w-sm space-y-2 mt-4">
                            <Input type="email" placeholder="Email" className="py-5" />
                            <Button type="submit">Subscribe</Button>
                        </form>
                    </div>
                </div>

                <div className="mt-12 flex items-center justify-between border-t pt-6">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} VITOBU. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <a href="#" className="text-muted-foreground hover:text-foreground">
                            <TwitterIcon className="h-6 w-6" />
                        </a>
                        <a href="#" className="text-muted-foreground hover:text-foreground">
                            <GithubIcon className="h-6 w-6" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
