# Prompt à donner à Claude (Claude Code) pour publier le site sur ton domaine

Dézippe le dossier, ouvre-le dans Claude Code (app desktop, onglet Code, ou `claude` dans un terminal ouvert dans le dossier), puis colle ce message :

---

Ce dossier est un site statique « Sent from my Pumpfun App » avec des fonctions serveur Vercel dans `api/` (pas de build, pas de package.json). Lis `GUIDE-CLIENT.md` d'abord. Je veux que tu le publies sur MON compte Vercel et MON domaine. Guide-moi étape par étape et demande-moi avant chaque action qui touche à mes comptes :

1. Vérifie que la CLI Vercel est installée (`npm i -g vercel` sinon), puis connecte-moi (`vercel login`).
2. Crée un nouveau projet Vercel depuis ce dossier (`vercel link` puis `vercel deploy`) et montre-moi le lien de test.
3. Branche mon domaine : [ÉCRIS TON DOMAINE ICI, ex. sentfrommypumpfun.app]. Dis-moi exactement quels enregistrements DNS ajouter chez mon registrar, puis vérifie que le domaine fonctionne.
4. Aide-moi à activer le classement X : créer le projet Supabase, lancer `supabase.sql` dans le SQL Editor, récupérer l'URL + la clé service_role, récupérer mon Bearer Token X, puis ajouter dans Vercel les variables `X_BEARER_TOKEN`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` et `CRON_SECRET` (génère-moi une valeur aléatoire pour CRON_SECRET). Ne mets jamais ces clés dans le code ni dans un fichier.
5. Publie en production (`vercel deploy --prod`), puis vérifie : la page s'ouvre, `/api/leaderboard` répond `"configured": true`, et lance une fois `/api/collect` avec l'en-tête `Authorization: Bearer <CRON_SECRET>` pour remplir le classement.
Ne modifie rien d'autre dans le code sans me demander.
