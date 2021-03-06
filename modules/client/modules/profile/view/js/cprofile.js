var compras = function(url,token){
    return new Promise(function(resolve, reject) {
        $.ajax({ 
                 type: 'POST', 
                 url: url,
                 data:{token:token},
                 dataType: 'json', 
             })
             .done(function( data) {
                 resolve(data);
             })
             .fail(function(textStatus) {
                   console.log("Error en la promesa");
        });
    });
}
var ver_mas = function(url,idfac,token){
    return new Promise(function(resolve, reject) {
        $.ajax({ 
                 type: 'POST', 
                 url: url,
                 data:{idfact: idfact},
                 dataType: 'json', 
             })
             .done(function( data) {
                 resolve(data);
             })
             .fail(function(textStatus) {
                   console.log("Error en la promesa");
        });
    });
}

function profile(){
    var datos = function(url){
            var token=localStorage.getItem('id_token');
            return new Promise(function(resolve, reject) {
                $.ajax({ 
                        type: 'POST', 
                        url: url,
                        data: {token:token},
                        dataType: 'json'
                    })
                    .done(function( data) {
                        resolve(data);
                    })
                    .fail(function(textStatus) {
                        console.log("Error en la promesa");
                });
            });
    }
    if(localStorage.getItem('id_token')!=null){
        var datos_coger = pretty("?module=profile&function=user_data");
        datos(datos_coger)//despues de coger los datos realiza lod e abajo
        .then(function(data){
            console.log(data);
            if(data[0]=="fail"){// si no hay usuario o los datos hay errores envia al login
                location.href = pretty("?module=login");
            }else{// si todo va bien pinta en profile.
                $('#profile_avatar').attr('src',data[0].avatar);
                $('#profile_name').html(data[0].first_name+" "+data[0].last_name);
                $('#info_body_cart').html(
                    '<p id="profile_id" class="mb-0"><b>ID: </b> '+data[0].id+'</p>'+
                    '<p id="profile_username" class="mb-0"><b>Username: </b> '+data[0].username+'</p>'+
                    '<p id="profile_email" class="mb-0"><b>Email: </b> '+data[0].email+'</p>'+
                    '<p id="profile_saldo" class="mb-0"><b>Saldo: </b> '+data[0].saldo+' $</p>'+
                    '<p id="profile_type" class="mb-0"><b>Rank: </b> '+data[0].type+'</p>'
                );
                //DESCOMENTAR CON EL CARRITO REALIZADO
                var token=localStorage.getItem('id_token');
                compras(pretty("?module=profile&function=get_facturas"),token)
                .then(function(data){
                    console.log(data.length);
                    // $('.compras').html('');
                    data.forEach(factura => {
                        $('.compras').append(
                        "<tr>"+
                            '<th>'+factura.idfactura+'</th>'+
                            '<td>'+factura.total_factura+'</td>'+
                            '<td>'+factura.fecha+'</td>'+
                            '<td>'+
                                '<i id="'+factura.idfactura+'" class="fas fa-eye fa-lg modal-toogle ver-mas"> </i>'+
                            '</td>'+
                        '</tr>'
                        );
                    });
                })
                .then(function(){
                    clicks();
                })
            }
            
        })
    }else{
        console.log("no login profile");
        // toastr.error("Necessitas estar logeado para hacer esto!","Logout");
        // setTimeout(function () {
        //     location.href = pretty('?module=login');
        // }, 1000);
    }

}
//DESCOMENTAR CON CART REALZIADO
function clicks(){
    $('.ver-mas').on('click', function(e) {
        idfact=$(this).attr("id");
        $('.modal-heading').html("Factura "+idfact);
        // console.log(idfact);
        ver_mas(pretty("?module=profile&function=more_facturas"),idfact)
        .then(function(lines){
            console.log(lines);
            $('.line_table').html("");
            lines.forEach(product =>{
                var nombre_producto="NOMBRE POR DEFECTO";
                var img_product="https://www.brdtex.com/wp-content/uploads/2019/09/no-image.png" //imagen que no tiene imagen dispoible
                $.ajax({ //este ajax lo que hace es coger la info de cada producto.
                    type: 'POST', 
                    url: pretty("?module=profile&function=product_info"),
                    data:{idproduct: product.idproduct},
                    dataType: 'json', 
                })
                .done(function( product_info) {
                    // console.log(product_info);//guarda la informacion en variables para despues pintarla
                    nombre_producto=product_info[0].nombre;
                    img_product=product_info[0].imagen;
                    // console.log(nombre_producto);
                    $('.line_table').append(
                        "<tr>"+
                            '<th>'+product.idlinea+'</th>'+
                            '<td><img class="cimagen" src="'+img_product+'">IDPRODUCT: '+product.idproduct+'</td>'+
                            '<td>'+nombre_producto+'</td>'+
                            '<td>'+product.qty+'</td>'+
                            '<td>'+product.cost+'</td>'+
                        '</tr>'
                    );
                })
                .fail(function(textStatus) {
                      console.log("Error en la promesa");
                });
            })
        })
        e.preventDefault();
        $('#modal_factura').toggleClass('is-visible');
      });
      $('.exit_modal').on('click', function(e) {
        e.preventDefault();
        $('#modal_factura').toggleClass('is-visible');
      });
}

function add_saldo(){
    var check_code = function(url,code,token){
        return new Promise(function(resolve, reject) {
            $.ajax({ 
                     type: 'POST', 
                     url: url,
                     data:{code: code,token: token},
                     dataType: 'json', 
                 })
                 .done(function( data) {
                     resolve(data);
                 })
                 .fail(function(textStatus) {
                       console.log("Error en la promesa");
            });
        });
    }
    $('#add_saldo').on('click', function(e) {
        var token=localStorage.getItem('id_token');
        $.confirm({
            title: 'Añádir Saldo',
            content: '' +
            '<form action="" class="formName">' +
                '<div class="form-group">' +
                    '<label>Ingresa tu gift code</label>' +
                    '<input type="text" placeholder="Gift code" class="code form-control" required />' +
                '</div>' +
            '</form>',
            buttons: {
                formSubmit: {
                    text: 'Submit',
                    btnClass: 'btn-blue',
                    action: function () {
                        var code = this.$content.find('.code').val();
                        if(!code){
                            $.alert('El campo no puede estar vacio');
                            return false;
                        }
                        check_code(pretty("?module=profile&function=check_code"),code,token)
                        .then(function(data){
                            console.log(data);
                            $.alert('Has ingresado ' + data + " $ en tu cuenta!");
                            pretty("?module=profile");

                        });
                        
                    }
                },
                cancel: function () {
                    //close
                },
            },
            onContentReady: function () {
                // bind to events
                var jc = this;
                this.$content.find('form').on('submit', function (e) {
                    // if the user submits the form by pressing enter in the field.
                    e.preventDefault();
                    jc.$$formSubmit.trigger('click'); // reference the button and click it
                });
            }
        });
    });
}

$(document).ready(function() {
    if(localStorage.getItem('id_token')==null){
        toastr.error("Necessitas estar logeado para hacer esto!","Logout");
        setTimeout(function () {
            location.href = pretty('?module=login');
        }, 1000);
    }
    // profile();//cargado en init.js del login
    // saldo();//cargado en init.js del login
})