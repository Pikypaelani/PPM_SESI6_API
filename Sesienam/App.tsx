
import { View, Text, ScrollView, TextInput, Button, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
  id: number; // ID produk
  product: string; // Nama produk
  NamaBarang: string; // Nama Barang
  Harga: number; // Harga
  Deskripsi: string; // Deskripsi
  Gambar: string; // URL gambar
}

const App = () => {
  const [datas, setDatas] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(''); // Nama produk
  const [NamaBarang, setNamaBarang] = useState(''); // Nama Barang
  const [Harga, setHarga] = useState(''); // Harga
  const [Deskripsi, setDeskripsi] = useState(''); // Deskripsi
  const [Gambar, setGambar] = useState(''); // URL gambar

  const API_URL = 'https://671af662acf9aa94f6ac293f.mockapi.io/products'; // Ganti dengan URL resource kamu

  const fetchData = () => {
    setLoading(true);
    axios
      .get(API_URL)
      .then(response => {
        setDatas(response.data);
      })
      .catch(error => {
        console.error(
          'Error fetching data:',
          error.response ? error.response.data : error.message,
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();

    // Menambahkan produk tas dan handphone secara manual jika belum ada
    const aerox: Product = {
      id: 0, // ID untuk motor (akan diganti oleh API)
      product: 'Aerox 2024',
      NamaBarang: 'Aerox 2024 Terbaru',
      Harga: 28000000,
      Deskripsi: 'Motor Ini Bisa Membuat Anda Tidak Jomblo Lagi Ha Ha',
      Gambar:
        'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//catalog-image/MTA-71055964/yamaha_yamaha_all_new_aerox_155_2024_-otr_jabodetabek-_full04_v19js08o.jpg',
    };

    const handphone: Product = {
      id: 0, // ID untuk handphone (akan diganti oleh API)
      product: 'Handphone',
      NamaBarang: 'Iphone',
      Harga: 15000000, // Misalnya harga Iphone
      Deskripsi: 'Handphone terbaru dari Apple',
      Gambar:
        'https://images.tokopedia.net/img/cache/200-square/VqbcmM/2024/9/3/bb35805f-6884-4e19-b5af-cd7132ef47f0.png.webp?ect=4g',
    };

    const motor: Product = {
      id: 0, // ID untuk handphone (akan diganti oleh API)
      product: 'Motor',
      NamaBarang: 'Aerox 2024',
      Harga: 20000000, // Misalnya harga Iphone
      Deskripsi: 'Ini Motor Membuat Anda tampan',
      Gambar:
        'https://www.harianaceh.co.id/media/2024/03/Yamaha-Aerox-2024.jpeg',
    };

    // Cek jika produk belum ada dan tambahkan jika belum ada
    axios.get(API_URL).then(response => {
      const existingTas = response.data.find(
        (item: Product) => item.product === aerox.product,
      );
      if (!existingTas) {
        addProductToAPI(aerox);
      }

      const existingHandphone = response.data.find(
        (item: Product) => item.product === handphone.product,
      );
      if (!existingHandphone) {
        addProductToAPI(handphone);
      }

      const existingMotor = response.data.find(
        (item: Product) => item.product === motor.product,
      );
      if (!existingMotor) {
        addProductToAPI(motor);
      }
    });
  }, []);

  const addProductToAPI = (product: Product) => {
    axios.post(API_URL, product).then(response => {
      setDatas(prevDatas => [response.data, ...prevDatas]);
    });
  };

  const addProduct = () => {
    if (!product || !NamaBarang || !Harga || !Deskripsi || !Gambar) {
      console.warn('Semua field harus diisi!');
      return;
    }

    const newProduct: Product = {
      id: 0, // ID untuk produk baru (akan diganti oleh API)
      product: product, // Nama produk
      NamaBarang: NamaBarang, // Nama Barang
      Harga: parseFloat(Harga), // Harga
      Deskripsi: Deskripsi, // Deskripsi
      Gambar: Gambar, // URL gambar
    };

    axios
      .post(API_URL, newProduct)
      .then(response => {
        setDatas(prevDatas => [response.data, ...prevDatas]); // Menambahkan produk baru ke state
        setProduct('');
        setNamaBarang('');
        setHarga('');
        setDeskripsi('');
        setGambar('');
      })
      .catch(error => {
        console.error('Error adding product:', error);
      });
  };

  const deleteProduct = (id: number) => {
    console.log('Menghapus produk dengan ID:', id);
    axios
      .delete(`${API_URL}/${id}`)
      .then(() => {
        console.log(`Produk dengan ID ${id} berhasil dihapus`);
        setDatas(datas.filter(item => item.id !== id));
      })
      .catch(error => {
        console.error(
          'Error deleting product:',
          error.response ? error.response.data : error.message,
        );
      });
  };

  const deleteAllProducts = () => {
    if (datas.length === 0) {
      console.warn('Tidak ada produk untuk dihapus.');
      return; // Tidak ada produk yang dihapus jika list kosong
    }

    const deletePromises = datas.map(data => {
      return axios.delete(`${API_URL}/${data.id}`).catch(error => {
        console.error(
          `Error deleting product with ID ${data.id}:`,
          error.response ? error.response.data : error.message,
        );
        return Promise.resolve();
      });
    });

    Promise.all(deletePromises)
      .then(() => {
        console.log('Semua produk berhasil dihapus');
        setDatas([]); // Mengosongkan state datas
      })
      .catch(error => {
        console.error(
          'Error deleting all products:',
          error.response ? error.response.data : error.message,
        );
      });
  };

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ padding: 10 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 10 }}>
        Buat Produk Baru
      </Text>
      <TextInput
        placeholder="Nama Produk"
        value={product} // Nama produk
        onChangeText={setProduct} // Set Nama produk
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <TextInput
        placeholder="Nama Barang"
        value={NamaBarang} // Nama Barang
        onChangeText={setNamaBarang} // Set Nama Barang
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <TextInput
        placeholder="Harga"
        value={Harga} // Harga
        onChangeText={setHarga} // Set Harga
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <TextInput
        placeholder="Deskripsi"
        value={Deskripsi} // Deskripsi
        onChangeText={setDeskripsi} // Set Deskripsi
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <TextInput
        placeholder="URL Gambar"
        value={Gambar} // URL gambar
        onChangeText={setGambar} // Set URL gambar
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Button title="Tambah Produk" onPress={addProduct} />
      <Button
        title="Hapus Semua Produk"
        onPress={deleteAllProducts}
        color="red"
      />
      <Text style={{ fontWeight: 'bold', fontSize: 20, marginVertical: 20 }}>
        Produk
      </Text>
      {datas.map(data => (
        <View
          key={data.id}
          style={{ margin: 10, padding: 10, borderWidth: 1, borderRadius: 5 }}>
          <Text style={{ fontWeight: 'bold' }}>{data.product}</Text>
          <Image
            source={{ uri: data.Gambar }}
            style={{ width: 100, height: 100, marginTop: 10 }}
          />
          <Text>Harga: Rp {data.Harga}</Text>
          <Text>Deskripsi: {data.Deskripsi}</Text>
          <Button title="Hapus Produk" onPress={() => deleteProduct(data.id)} />
        </View>
      ))}
    </ScrollView>
  );
};

export default App;
