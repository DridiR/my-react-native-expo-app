export const isValidEmail = (value) => {
    const regx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regx.test(value);
};

export const isValidObjField = (obj) => {
    for (const key in obj) {
        // Vérifie si la valeur du champ est vide ou ne contient que des espaces
        if (!obj[key].trim()) {
            return false; // Si un champ est vide, retourne false
        }
    }
    return true; // Si tous les champs sont remplis, retourne true
};

export const updateError = (errorMessage, setError) => {
    setError(errorMessage);
    setTimeout(() => {
        setError('');
    }, 2500);
};
