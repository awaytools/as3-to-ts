package
{
	public class DynamicClass
	{
		public function DynamicClass()
		{
			var myClass:SubDynamicClass = new SubDynamicClass();
			myClass.a = 10;
			trace(myClass);
		}
	}

	dynamic class SubDynamicClass{

	}
}