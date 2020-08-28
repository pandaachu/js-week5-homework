
// 全域註冊 VueLoading
Vue.component('loading', VueLoading);

Vue.component('ValidationProvider', VeeValidate.ValidationProvider);
Vue.component('ValidationObserver', VeeValidate.ValidationObserver);
VeeValidate.configure({
  classes: {
    valid: 'is-valid',
    invalid: 'is-invalid',
  }
});

new Vue({
  el: '#app',
  data: {
    tempProduct: {},
    products: [],
    isLoading: false,
    carts: [],
    cartTotal: 0,
    status: {
      loadingItem: '', // 要預先定義 loadingItem, 不然會出錯
    }, // 讀取效果
    uuid: '289038e7-cea7-4a49-afd4-86ec766c3f7f',
    apiPath: 'https://course-ec-api.hexschool.io',
    form: {
      username: '',
      email: '',
      phone: '',
      address: '',
      payment: '',
      message: '',
    },
  },
  methods: {
    //取出產品列表
    getProducts(page = 1){ // 參數預設值
      this.isLoading = true; // 打開 isLoading
      const url = `${this.apiPath}/api/${this.uuid}/ec/products?page=${page}`;
      // 取得遠端資料
      axios.get(url)
      .then(res => {
        // console.log(res);
        this.isLoading = false; // 讀取完關閉 isLoading
        this.products = res.data.data;
      })
      .catch(error =>{
        this.isLoading = false; // 讀取失敗時關閉 isLoading, 不然會一直在 loading 畫面
      })
    },
    addToCart(id, quantity = 1){ // 加入購物車，帶入商品 id 及數量
      this.isLoading = true;
      const url =`${this.apiPath}/api/${this.uuid}/ec/shopping`;
      const cart = { // 定義資料
        "product":id,
        "quantity": quantity, // ES6 的寫法: quantity
      };
      // console.log(cart);
      axios.post(url, cart)
      .then(res => {
        this.isLoading = false;
        console.log(res);
        this.getCart() ;
      })
      .catch(error =>{
        this.isLoading = false;
        // axios 固定的寫法，否則 error 訊息不會出現
        console.log(error.response);
      })
    },
    getProduct(id){ // 單一產品資料取出
      this.status.loadingItem = id; // 把產品 id 存在 status.loadingItem
      const url =`${this.apiPath}/api/${this.uuid}/ec/product/${id}`;
      // console.log(id)
      axios.get(url)
      .then(res => {
        console.log(res);
        this.status.loadingItem = ''; // 清空
        this.tempProduct = res.data.data;
        // 沒有辦法直接寫入的時候，可以使用這兩種方法把值寫進去
        this.tempProduct.num = 1; // 方法一：補上數量，預設為 1
        // 方法二：this.$set(this.tempProduct, 'num' , 1;);
        // 存完資料把 modal 打開
        $('#productModal').modal('show')
      })

    },
    getCart(){ // 取得購物車資料
      this.isLoading = true;
      const url =`${this.apiPath}/api/${this.uuid}/ec/shopping`;
      axios.get(url)
      .then(res => {
        console.log('cart',res);
        this.isLoading = false;
        this.carts = res.data.data;
        this.updateTotal();
      });
    },
    // 在取得購物車的時候才會做計算，刪除購物車的時候就沒有重計算
    // 所以這段要挑出來寫
    updateTotal(){
      this.carts.forEach(item => {
        this.cartTotal += item.product.price * item.quantity
      });
    },
    updateQuantity(id, quantity){ // 更新數量
      this.isLoading = true;
      const url =`${this.apiPath}/api/${this.uuid}/ec/shopping`;
      const cart = { // 定義資料
        "product":id,
        "quantity": quantity, // ES6 的寫法: quantity
      };
      // console.log(cart);
      axios
      .patch(url, cart)
      .then(res => {
        this.isLoading = false;
        console.log(res);
        this.getCart() // 更新完數量要重新取得購物車資料
      })
      .catch(error =>{
        this.isLoading = false;
        // axios 固定的寫法，否則 error 訊息不會出現
        console.log(error.response);
      })
    },
    // removeItem(id) {
    //   const url = `${this.apiPath}/api/${this.uuid}/ec/shopping/${id}`;
    //   this.isLoading = true;
    //   axios
    //   .delete(url)
    //   .then(res => {
    //     this.isLoading = false;
    //     this.getCart();
    //     this.updateTotal()
    //   });
    // },
    // deleteAll(){
    // this.isLoading = true;
    // const url = `${this.apiPath}/api/${this.uuid}/ec/shopping/all/product`;
    // axios.delete(url)
    //   .then(res => {
    //     this.isLoading = false;
    //     this.getCart();
    //   });
    //   // console.log(this.total_cost)
    //   this.cartTotal=0;
    // },
    sendOrder(){
      alert("訂單完成");
    }
  },
  created() {
    this.getProducts(); // 要使用 this 去取得 getProducts()
    this.getCart()
  }
})