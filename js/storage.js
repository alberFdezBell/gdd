/**
 * storage.js
 * Gestión de almacenamiento local (localStorage) e importación/exportación JSON
 */

const STORAGE_KEY = 'gdd_studio_collection_v1';
const ACTIVE_GDD_KEY = 'gdd_studio_active_id';

const StorageService = {
    getAllGdds() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error al leer GDDs de localStorage', e);
            return [];
        }
    },

    saveAllGdds(gdds) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(gdds));
        } catch (e) {
            console.error('Error al guardar GDDs en localStorage', e);
            if (typeof ModalModule !== 'undefined') {
                ModalModule.alert('Almacenamiento Lleno', 'No se pudo guardar el GDD en el navegador. Si has cargado imágenes muy pesadas, intenta reducirlas de tamaño.');
            }
        }
    },

    getGddById(id) {
        const list = this.getAllGdds();
        return list.find(item => item.id === id) || null;
    },

    saveGdd(gdd) {
        if (!gdd || !gdd.id) return;
        gdd.updatedAt = new Date().toISOString();
        const list = this.getAllGdds();
        const index = list.findIndex(item => item.id === gdd.id);
        if (index >= 0) {
            list[index] = gdd;
        } else {
            list.unshift(gdd);
        }
        this.saveAllGdds(list);
        this.setActiveGddId(gdd.id);
    },

    deleteGdd(id) {
        let list = this.getAllGdds();
        list = list.filter(item => item.id !== id);
        this.saveAllGdds(list);
        if (this.getActiveGddId() === id) {
            const nextActive = list[0] ? list[0].id : null;
            this.setActiveGddId(nextActive);
        }
    },

    duplicateGdd(id) {
        const original = this.getGddById(id);
        if (!original) return null;
        const copy = JSON.parse(JSON.stringify(original));
        copy.id = "gdd_" + Date.now();
        copy.cover.title = copy.cover.title + " (Copia)";
        copy.updatedAt = new Date().toISOString();
        this.saveGdd(copy);
        return copy;
    },

    getActiveGddId() {
        return localStorage.getItem(ACTIVE_GDD_KEY) || null;
    },

    setActiveGddId(id) {
        if (id) {
            localStorage.setItem(ACTIVE_GDD_KEY, id);
        } else {
            localStorage.removeItem(ACTIVE_GDD_KEY);
        }
    },

    exportToJson(gdd) {
        if (!gdd) return;
        const filename = (gdd.cover.title || 'gdd').toLowerCase().replace(/[^a-z0-9]/gi, '_') + '.json';
        const jsonStr = JSON.stringify(gdd, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    importFromJsonFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const parsed = JSON.parse(e.target.result);
                    if (!parsed.cover || !parsed.cover.title) {
                        throw new Error('El archivo JSON no contiene la estructura de un GDD válido.');
                    }
                    parsed.id = "gdd_" + Date.now();
                    resolve(parsed);
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = () => reject(new Error('Error al leer el archivo.'));
            reader.readAsText(file);
        });
    }
};
