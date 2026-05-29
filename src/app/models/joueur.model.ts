export interface Joueur {
  id: number;
  nom: string;
  prenom: string;
  nationality: string;
  numero: number;
  taille: number;
  poids: number;
  datenaissance: string;
  id_poste: number;
  id_user: number | null;
}