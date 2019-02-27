<html>
	<head>
		<title>Tools</title>

		<style type='text/css'>
			body {
				font-family: Arial;
			}

			.fields2 {
				width: 50%;
			}

			.fields3 {
				width: 33%;
			}

			#lbmCalc {
				width: 50%;
				margin: 0 auto;
			}

			#resultDiv {
				text-align: center;
				padding-top: 10px;
				line-height: 150%;
			}

			input, label, select {
			    display:block;
			}

		</style>

		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

	</head>
	<body>
		<h1 class='text-center'>
			LBM sizing
		</h1>

		<form id='lbmCalc'>
			<div class='form-group'>
				<label for='nodes'>Number of Nodes</label>
				<input type="text" name='nodes' id='nodes' value='1' class="form-control">
			</div>
			<div class='form-group'>
				<label for='gb'>NotImplementedYet: Target gb per core</label>
				<input type="text" name='gb' id='gb' value='4' class="form-control">
			</div>
			<div class='form-group'>
				<label for='cores'>Number of cores available per node</label>
				<input type="text" name='cores' id='cores' value='4' class="form-control">
			</div>

			<div class='form-group'>
				<label for='vectors'>Number of Vectors</label>
				<select id='vectors' name='vectors' class="form-control">
					<option value="9">9</option>
					<option selected value="19">19</option>
					<option value="27">27</option>
				</select>
			</div>
			<div class='form-group'>
				<label for='vtype'>Type of Vectors</label>
				<select id='vtype' name='vtype' class="form-control">
					<option value="4">Single (4)</option>
					<option value="8">Double (8)</option>
				</select>
			</div>

			<div class='form-group'>
				<!-- Mutex -->
				<label for='nx'>Size of nx for cube</label>
				<input type="text" name='nx' id='nx' onfocusout='shouldDisableOtherFields(this)' class='lbmInput form-control'>
			</div>
			<div class='form-group'>
				<label for='terra'>Num of terrabytes available, returns nx: size of cube</label>
				<input type="text" name='terra' id='terra' onfocusout='shouldDisableOtherFields(this)' class='lbmInput form-control'>
			</div>

			<div class='form-group'>
					<label for='giga'>Num of gigabytes available, returns nx: size of cube</label>
					<input type="text" name='giga' id='giga' onfocusout='shouldDisableOtherFields(this)' class='lbmInput form-control'>
			</div>	
			<div class='form-group'>
					<label for='mega'>Num of megabytes available, returns nx: size of cube</label>
					<input type="text" name='mega' id='mega' onfocusout='shouldDisableOtherFields(this)' class='lbmInput form-control'>
			</div>

			<div>
				<input type="button" id="formSubmit" value="Calculate!" class="btn btn-primary center-block" onclick="calculateLbm()">
			</div>
		</form>

		<h4 id='resultDiv'></div>

		<script type='text/javascript'>

			/**
			 * Trigger on change of focus of one of the mutex group, and disable other inputs if that one now contains text.
			 * @param {object} elem - The element we focused-out from.
			 */
			function shouldDisableOtherFields(elem) {
				// Grip all inputs of the mutex
				var elements = document.getElementsByClassName('lbmInput');
				
				// If the element contains data, disable all others except for our element.
				
				Array.prototype.forEach.call(elements, function(curElem, elemIndex, elemArray) {
					if (curElem == elem)
						return

					// Disable/ enable according to the value 
					curElem.disabled = elem.value;
				});

			}

			/**
			 * TODO: Add documentation
			 * @param {int} size - <Add descrtiption>
			 */
			function sizeText(size) {
			    if (size / Math.pow(1024, 4.0) > 1)
			        return (size / Math.pow(1024, 4.0)).toFixed(2).toString() + "tb"

			    else if (size / Math.pow(1024, 3.0) > 1)
			        return (size / Math.pow(1024, 3.0)).toFixed(2).toString() + "gb"

			    else if (size / Math.pow(1024, 2.0) > 1)
			        return (size / Math.pow(1024, 2.0)).toFixed(2).toString() + "mb"

			    else
			        return (size / 1024.0).toFixed(2).toString() + "kb"
			}

			/**
			 * Utility function added to String for formatting.
			 */
			String.prototype.format = function()
			{
			   var content = this;
			   for (var i=0; i < arguments.length; i++)
			   {
			        var replacement = '{' + i + '}';
			        content = content.replace(replacement, arguments[i]);  
			   }
			   return content;
			};

			/**
			 * Do the calculation
			 */
			function calculateLbm() {
				var formData = document.getElementById('lbmCalc');

				var nodes = formData.nodes.value;
				var gb = formData.gb.value;
				var cores = formData.cores.value;

				var vectors = formData.vectors.value;
				var vtype = formData.vtype.value;

				var nx = formData.nx.value;
				var terra = formData.terra.value;
				var giga = formData.giga.value;
				var mega = formData.mega.value;

				// Stoney either 640 or 320 nodes Xeon E5-2695
				// 24 threads 
				var _cores = 12 

				// Print content

				var txtMsg = [];
				txtMsg.push("Params Q: {0} vType: {1}".format(vectors, (vtype == 4 ? 'Single' : 'Double')));

				if (nx)
				{
				    var size = Math.pow(nx, 3) * vtype * vectors;

				    // ngx should be even an even number and divisable by cores
				    var ngx = Math.pow(nodes, (1 / 3.0));

				    var nx_per_core = Math.ceil(nx / ngx / cores / 2.0) * 2 ;
				    var nx = nx_per_core * cores;
				    var snx = ngx * nx;

				    size = Math.pow(snx, 3) * vtype * vectors;

				    // Output size of vector is always single (float)
				    output_size = Math.pow(snx, 3) * 4 * 3 ;
				    output_plane_size = Math.pow(snx, 2) * 4 * 3 ;

				    txtMsg.push("Exact sizing, total space snx:{0}  per grid nx:{1}".format(nx * ngx, nx));

				    if (nodes == 1)
				        txtMsg.push("Need 1 node with {0} available for cube of nx={1}".format(sizeText(size), snx));
				    else
                        txtMsg.push("Need {0} nodes with {1} each for cube of nx={2} (total {3})".format(nodes, sizeText(size / nodes), snx, sizeText(size)));

				    txtMsg.push("Size of cube of output vectors {0}, or per node {1}".format(sizeText(output_size), sizeText(output_size / nodes)));
				    txtMsg.push("Size of output plane (slice) vectors {0}, or per node {1}".format(sizeText(output_plane_size), sizeText(output_plane_size / nodes)));

				    txtMsg.push("Works out at {0} per core, with {1} core{2}".format(sizeText(size / nodes / cores), cores, cores > 1 ? 's' : ''));
				}
				else if (terra)
				    txtMsg.push("Size of nx cube '{0}' with {1}tb available".format(Math.pow((terra * Math.pow(1024, 2) / vtype / vectors), (1 / 3.0)), terra));
				else if (giga)
				    txtMsg.push("Size of nx cube '{0}' with {1}gb available".format(Math.pow((giga * Math.pow(1024, 3) / vtype / vectors), (1 / 3.0)), giga));
				else if (mega)
				    txtMsg.push("Size of nx cube '{0}' with {1}mb available".format(Math.pow((mega * Math.pow(1024, 4) / vtype / vectors), (1 / 3.0)), mega));

				// Publish the results
				var resultDiv = document.getElementById('resultDiv');

				
				resultDiv.innerHTML = txtMsg.join('<br />');
				$('html, body').animate({
        			scrollTop: $("#resultDiv").offset().top
    			}, 2000);
			}
		</script>

		<script src="https://code.jquery.com/jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossorigin="anonymous"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
	</body>
</html>
