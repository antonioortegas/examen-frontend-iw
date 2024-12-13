<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { uploadFileToCloudinary } from '@/services/uploadService';

const email = ref(''); // Registered user email
const visit = ref(''); // Email of the user being visited
const marcadores = ref([]);
const visits = ref([]); // Initialize visits array
const address = ref('');
const imageSrc = ref('');
const imageFileName = ref('');
const map = ref(null);
const markerLayer = ref(null);
const fileInput = ref(null); // Reference to the file input element

// Initialize the map on mount
onMounted(() => {
    map.value = L.map('map').setView([34, -43], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
    }).addTo(map.value);

    markerLayer.value = L.layerGroup().addTo(map.value);
});

// Fetch data for the user's map (for registered user)
const fetchUserMap = async () => {
    if (!email.value) {
        alert("Please enter your email first.");
        return;
    }
    try {
        const response = await axios.get(`http://localhost:3001/api/mapa/${email.value}`);
        marcadores.value = response.data.marcadores;
        visits.value = response.data.visitas.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort visits by timestamp

        // Render existing markers
        markerLayer.value.clearLayers();
        if (!marcadores.value) return;
        marcadores.value.forEach((m) => {
            const marker = L.marker([m.coordenadas.lat, m.coordenadas.lng]).addTo(markerLayer.value);
            marker.bindPopup(`<strong>${m.nombreLugar}</strong><br><img src="${m.imagenUrl}" alt="" style="width:100px;"/>`);
        });
    } catch (error) {
        console.error('Error fetching user map:', error);
    }
};

// Fetch data for the visited user's map
const fetchVisitMap = async () => {
    if (!visit.value) {
        alert("Please enter the email of the user you want to visit.");
        return;
    }
    try {
        const response = await axios.get(`http://localhost:3001/api/mapa/${visit.value}`);
        marcadores.value = response.data.marcadores;
        visits.value = response.data.visitas.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort visits by timestamp

        // Render the visited user's markers
        markerLayer.value.clearLayers();
        if (!marcadores.value) return;
        marcadores.value.forEach((m) => {
            const marker = L.marker([m.coordenadas.lat, m.coordenadas.lng]).addTo(markerLayer.value);
            marker.bindPopup(`<strong>${m.nombreLugar}</strong><br><img src="${m.imagenUrl}" alt="" style="width:100px;"/>`);
        });
    } catch (error) {
        console.error('Error fetching visited user map:', error);
    }
};

// Handle file upload and get image URL from Cloudinary
const handleFileUpload = async () => {
    if (fileInput.value.files.length === 0) {
        alert("Please select a file first.");
        return;
    }

    const file = fileInput.value.files[0];
    try {
        console.log('Uploading file:', file);

        // Use the utility function to upload and get the URL
        const imageUrl = await uploadFileToCloudinary(file);

        // Update the image URL and filename
        imageSrc.value = imageUrl;
        imageFileName.value = file.name;
        console.log('File uploaded successfully, image URL:', imageUrl);
    } catch (error) {
        console.error('Error uploading the image:', error);
    }
};

// Handle geolocation and marker creation
const findLocationAndAddMarker = async () => {
    if (!address.value.trim()) {
        alert('Please enter an address.');
        return;
    }

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address.value)}`
        );
        const data = await response.json();

        if (data.length === 0) {
            alert('No results found for the given address.');
            return;
        }

        const { lat, lon, display_name } = data[0];
        const newMarker = {
            nombreLugar: display_name,
            coordenadas: { lat: parseFloat(lat), lng: parseFloat(lon) },
            imagenUrl: imageSrc.value || null,
        };

        // Save marker to the backend
        await axios.post('http://localhost:3001/api/mapa/marcador', { email: email.value, ...newMarker });
        fetchUserMap();
        alert('Marker added successfully!');
    } catch (error) {
        console.error('Error adding marker:', error);
        alert('Failed to add marker.');
    }
};
</script>

<template>
    <div>
        <!-- Navbar displaying the username if the user is registered -->
        <nav class="bg-blue-500 p-4 flex justify-between items-center">
            <div class="text-white font-bold text-xl">
                <span v-if="email">Welcome, {{ email }}</span>
                <span v-else>Please register</span>
            </div>
            <div>
                <input v-model="email" type="email" placeholder="Enter your email" class="p-2 border rounded" />
                <button @click="fetchUserMap" class="px-4 py-2 bg-blue-700 text-white rounded ml-2">
                    Set as Registered User
                </button>
            </div>
        </nav>

        <!-- Main content below the navbar -->
        <div class="p-4">
            <h1 class="text-2xl font-bold mb-4">Mi Mapa</h1>

            <!-- Email input for visiting another user's map -->
            <div class="flex space-x-2 mb-4">
                <input v-model="visit" type="email" placeholder="Enter the email you want to visit"
                    class="p-2 border rounded w-full" />
                <button @click="fetchVisitMap" class="px-4 py-2 bg-blue-500 text-white rounded">
                    View Map
                </button>
            </div>

            <!-- Address and file input for adding markers -->
            <div v-if="!visit" class="flex flex-col sm:flex-row items-center gap-4 bg-gray-100 p-6 rounded-lg shadow-md w-full mx-auto">
                <!-- File Upload Section -->
                <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center sm:items-start">
                    <!-- Hidden File Input -->
                    <input ref="fileInput" type="file" class="hidden" @change="handleFileUpload" />

                    <!-- Button to Trigger File Upload -->
                    <button @click="fileInput.click()" class="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out w-full sm:w-auto">
                        Select Image
                    </button>
                </div>

                <!-- Display Filename and URL -->
                <div v-if="imageSrc" class="mt-4 sm:mt-0 text-center sm:text-left text-gray-700 w-full sm:w-auto">
                    <div v-if="imageFileName" class="mb-2">
                        <span class="font-semibold">Filename: </span>
                        <span class="text-blue-500">{{ imageFileName }}</span>
                    </div>

                    <div>
                        <span class="font-semibold">Uploaded to: </span>
                        <a :href="imageSrc" target="_blank" class="text-blue-500 break-all">{{ imageSrc }}</a>
                    </div>
                </div>
            </div>

            <!-- Address input for adding markers -->
            <input v-if="!visit" type="text" v-model="address" placeholder="Enter an address"
                class="p-2 border rounded w-full mb-2" />

            <div v-if="!visit">
                <button @click="findLocationAndAddMarker" class="px-4 py-2 bg-blue-500 text-white rounded">
                    Add Marker
                </button>
            </div>
        </div>

        <!-- Mapa -->
        <div id="map" style="height: 500px; width: 100%;"></div>

        <!-- Lista de marcadores -->
        <div class="mt-6">
            <h2 class="text-xl font-semibold mb-4">Marcadores:</h2>
            <div class="grid gap-4 p-4 grid-cols-[repeat(auto-fit,_minmax(12rem,_1fr))]">
                <div v-for="m in marcadores" :key="m.nombreLugar" class="bg-white rounded-lg shadow-md hover:-translate-y-2 duration-300 flex flex-col p-4">
                    <!-- Lat and Lon Section at the Top -->
                    <div class="text-xs text-gray-500 mb-2">
                        Lat: {{ m.coordenadas.lat }}, Lng: {{ m.coordenadas.lng }}
                    </div>
                    <!-- Image Section -->
                    <div class="flex-grow mb-2">
                        <div v-if="m.imagenUrl">
                            <img :src="m.imagenUrl" alt="Imagen del lugar" class="w-full h-32 object-cover rounded-md" />
                        </div>
                    </div>
                    <!-- Title Section Below the Image -->
                    <div class="text-center flex flex-col items-center">
                        <h3 class="text-sm font-semibold text-gray-700">{{ m.nombreLugar }}</h3>
                    </div>
                </div>
            </div>
        </div>

        <!-- Visits Section -->
        <div class="mt-6">
            <h2 class="text-xl font-semibold mb-4">Visits:</h2>
            <div v-if="visits.length === 0" class="text-center text-gray-500">
                No visits yet.
            </div>
            <div v-else class="space-y-4">
                <div v-for="visit in visits" :key="visit.timestamp" class="bg-gray-100 p-4 rounded-lg shadow-md">
                    <div class="flex justify-between items-center">
                        <div class="text-sm text-gray-500">Visited by: <strong>{{ visit.visitanteEmail }}</strong></div>
                        <div class="text-xs text-gray-400">{{ new Date(visit.timestamp).toLocaleString() }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
#map {
    margin: auto;
}
</style>
