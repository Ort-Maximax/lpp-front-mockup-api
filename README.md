[![forthebadge](https://forthebadge.com/images/badges/fo-shizzle.svg)](https://forthebadge.com)


[![Build Status](https://travis-ci.org/Ort-Maximax/lpp-front-mockup-api.svg?branch=master)](https://travis-ci.org/Ort-Maximax/lpp-front-mockup-api) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/b6573aec1704497788e0fceed4762121)](https://www.codacy.com/app/EISAWESOME/lpp-front-mockup-api?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Ort-Maximax/lpp-front-mockup-api&amp;utm_campaign=Badge_Grade)

# Mockup API

API de mockup pour tester le client correctement
Build sur Travis, deploie sur Heroku
https://valparaiso-mockup.herokuapp.com


---

## /auth/:provider
Authentification API
  - /auth/google

---

## /time
Retourne l'heure du serveur, utiliser pour vérifié la validité d'un JWT

---

## /getData
Retourne un objet représentant le dossier Valparaiso d'un utilisateur

---

## /streamFile
Retourne un stream du path fournis en parametre

---

## /removeFile
Supprime le/le fichier(s) spécifié(s)

---

## /downloadFile
Télécharge le/les fichier(s) spécifiés

---

## /uploadFile
Sauvegarde le/les fichier(s) sur le serveur au path fournit
