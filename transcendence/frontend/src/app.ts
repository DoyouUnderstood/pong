import { router} from "./services/routeurService.js";
import { HomeRoute } from "./routes/HomeRoute.js";
import { LoginRoute } from "./routes/LoginRoute.js";
import { SignupRoute } from "./routes/SignupRoute.js";
import { SettingsRoute } from "./routes/SettingsRoute.js";
import "./services/authService.js"; // ← important : forcer l’instanciation

router.addRoute('home', new HomeRoute());
router.addRoute('login', new LoginRoute());
router.addRoute('signup', new SignupRoute());
router.addRoute('settings', new SettingsRoute());
router.setup(document.getElementById('app')!);


// Support des flèches ← →


document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "A") {
        const href = (target as HTMLAnchorElement).getAttribute("href");
        if (href?.startsWith("/")) {
            e.preventDefault();
            router.naviguate(href.slice(1));
        }
    }
});

router.naviguate('login');
