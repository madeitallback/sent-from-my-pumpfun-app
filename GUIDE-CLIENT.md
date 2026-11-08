# Sent from my Pumpfun App : guide client

## Ce qui est nouveau
- **Road to $1B** : la barre de Mcap va jusqu'à $1B, avec des repères à $100K, $1M, $10M, $100M et $1B. Les paliers continuent de s'afficher à chaque étape ($50K, $100K, $250K…).
- **Best callouts** : les meilleurs callouts $App de pump.fun apparaissent dans le feed, chacun transformé en meme par le générateur (post, ticket de caisse, Discord, notification…). Le bouton « Remix » ouvre le générateur avec ce meme.
- **Bagworkers** : le classement des comptes qui postent le plus « Sent from my Pumpfun App » sur X (24h / 7 jours / depuis le début). **S'active une fois l'étape ci-dessous faite.**

---

## 1. Activer le classement X (une seule fois, ~15 min)

### a) Supabase (base de données gratuite)
1. Crée un compte sur https://supabase.com, puis **New project**.
2. Ouvre **SQL Editor**, colle le contenu du fichier `supabase.sql` et clique sur **Run**.
3. Va dans **Project Settings → API** et copie :
   - la **Project URL** (`https://xxxx.supabase.co`)
   - la clé **service_role** (secrète, ne la partage jamais)

### b) API X
1. Sur https://console.x.com, crée une app et ajoute des crédits (paiement à l'usage).
2. Fixe une **limite de dépense mensuelle** (ex. 50 $).
3. Copie le **Bearer Token**.

### c) Vercel
Dans **Vercel → le projet → Settings → Environment Variables**, ajoute :

| Nom | Valeur |
|---|---|
| `X_BEARER_TOKEN` | le Bearer Token X |
| `SUPABASE_URL` | la Project URL Supabase |
| `SUPABASE_SERVICE_KEY` | la clé service_role Supabase |
| `CRON_SECRET` | une longue suite aléatoire de ton choix (ex. 40 lettres et chiffres) |

Puis **Deployments → … → Redeploy**. C'est tout.

**Fonctionnement :** chaque jour à 7h00 (UTC), le site récupère les nouveaux posts X qui disent « Sent from my Pumpfun App » (majuscules ou pas) et met le classement à jour. L'onglet « Bagworkers » apparaît tout seul.

**Anti-spam :** 15 posts max comptés par compte et par jour, un texte identique posté deux fois ne compte qu'une fois, les retweets ne comptent pas, et les comptes de moins de 30 jours sont ignorés.

**Coût :** seuls les nouveaux posts sont lus (jamais deux fois les mêmes), et un passage lit 500 posts au maximum. Avec quelques dizaines de posts par jour, compte environ 10 à 20 $ par mois. Vérifie dans la console X après les premiers jours.

---

## 2. Mettre à jour les callouts : un clic

### Une seule fois (~3 min)
1. Pour que les mises à jour se publient toutes seules, le site doit être relié au dépôt GitHub dans Vercel (**Add New → Project → Import** le dépôt). C'est le cas si tu l'as importé depuis GitHub.
2. Ouvre la page **`/update`** de ton site (ex. `https://ton-site.com/update`) :
   - **Le bouton :** affiche ta barre de favoris (`Ctrl+Maj+B`, ou `Cmd+Maj+B` sur Mac) et **glisse le bouton « ↻ Callouts $App »** dedans.
   - **La clé GitHub :** clique sur le lien de la page, qui ouvre GitHub avec le formulaire déjà rempli. Choisis seulement le dépôt du site à « Repository access », clique sur **Generate token**, copie le code `github_pat_…`, colle-le sur la page `/update` et clique sur **Enregistrer**.

   Cette clé ne peut modifier que ce dépôt et reste dans ton navigateur.

### Ensuite, à chaque fois
Va sur la page du coin sur pump.fun et clique sur **↻ Callouts $App** dans tes favoris. Les callouts partent sur GitHub et le site se met à jour tout seul en une minute environ.

> Le bouton marche sur Chrome, Brave et Edge. Utilise toujours le même navigateur : la clé est enregistrée dans celui-ci.

### Méthode de secours (si le bouton ne marche pas)
1. Ouvre https://pump.fun/coin/49nkLrXi8nCZBVKsShDNasEtPe4Vn1mx9Xbr3kTa8pTL
2. Appuie sur **F12**, ouvre l'onglet **Console**, colle le contenu de `tools/export-callouts.js` et appuie sur **Entrée**.
3. Un fichier `callouts.json` se télécharge : sur GitHub, ouvre le dossier `data`, puis **Add file → Upload files**, dépose le fichier et valide. Le site se met à jour tout seul.
